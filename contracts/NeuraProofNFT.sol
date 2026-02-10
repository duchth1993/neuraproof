// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title NeuraProofNFT
 * @dev Soulbound NFT for verified income proofs on Neura Testnet
 * @notice This contract mints non-transferable NFTs containing verified income metrics
 */
contract NeuraProofNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Income verification data structure
    struct IncomeProof {
        address walletAddress;
        uint256 verificationTimestamp;
        uint256 averageMonthlyIncome; // In USN (18 decimals)
        string paymentFrequency; // "weekly", "bi-weekly", "monthly"
        uint256 employerCount;
        bytes32 verificationHash;
        bool isValid;
    }
    
    // Mapping from token ID to income proof
    mapping(uint256 => IncomeProof) public incomeProofs;
    
    // Mapping from wallet address to their token IDs
    mapping(address => uint256[]) public walletTokens;
    
    // Whitelisted payroll contracts
    mapping(address => bool) public whitelistedPayrollContracts;
    address[] public payrollContractList;
    
    // Permitted jurisdictions (true = permitted)
    mapping(bytes32 => bool) public permittedJurisdictions;
    bytes32[] public jurisdictionList;
    
    // Soulbound toggle (true = non-transferable)
    bool public isSoulbound = true;
    
    // Events
    event IncomeProofMinted(
        uint256 indexed tokenId,
        address indexed wallet,
        uint256 averageMonthlyIncome,
        uint256 employerCount,
        bytes32 verificationHash
    );
    
    event PayrollContractWhitelisted(address indexed contractAddress, bool status);
    event JurisdictionUpdated(bytes32 indexed jurisdictionCode, bool permitted);
    event ProofInvalidated(uint256 indexed tokenId);
    
    constructor() ERC721("NeuraProof Income Verification", "NPROOF") Ownable(msg.sender) {
        // Initialize with some default permitted jurisdictions
        _addJurisdiction("US");
        _addJurisdiction("UK");
        _addJurisdiction("EU");
        _addJurisdiction("CA");
        _addJurisdiction("AU");
        _addJurisdiction("SG");
        _addJurisdiction("JP");
    }
    
    /**
     * @dev Add a jurisdiction to permitted list
     */
    function _addJurisdiction(string memory code) internal {
        bytes32 jurisdictionHash = keccak256(abi.encodePacked(code));
        permittedJurisdictions[jurisdictionHash] = true;
        jurisdictionList.push(jurisdictionHash);
    }
    
    /**
     * @dev Check if a jurisdiction is permitted
     */
    function isJurisdictionPermitted(string memory jurisdictionCode) public view returns (bool) {
        bytes32 jurisdictionHash = keccak256(abi.encodePacked(jurisdictionCode));
        return permittedJurisdictions[jurisdictionHash];
    }
    
    /**
     * @dev Update jurisdiction permission status
     */
    function setJurisdictionPermission(string memory jurisdictionCode, bool permitted) external onlyOwner {
        bytes32 jurisdictionHash = keccak256(abi.encodePacked(jurisdictionCode));
        permittedJurisdictions[jurisdictionHash] = permitted;
        
        if (permitted) {
            bool exists = false;
            for (uint i = 0; i < jurisdictionList.length; i++) {
                if (jurisdictionList[i] == jurisdictionHash) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                jurisdictionList.push(jurisdictionHash);
            }
        }
        
        emit JurisdictionUpdated(jurisdictionHash, permitted);
    }
    
    /**
     * @dev Whitelist or remove a payroll contract
     */
    function setPayrollContractWhitelist(address contractAddress, bool status) external onlyOwner {
        whitelistedPayrollContracts[contractAddress] = status;
        
        if (status) {
            bool exists = false;
            for (uint i = 0; i < payrollContractList.length; i++) {
                if (payrollContractList[i] == contractAddress) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                payrollContractList.push(contractAddress);
            }
        }
        
        emit PayrollContractWhitelisted(contractAddress, status);
    }
    
    /**
     * @dev Get all whitelisted payroll contracts
     */
    function getWhitelistedPayrollContracts() external view returns (address[] memory) {
        return payrollContractList;
    }
    
    /**
     * @dev Mint an income proof NFT
     */
    function mintIncomeProof(
        address recipient,
        uint256 averageMonthlyIncome,
        string memory paymentFrequency,
        uint256 employerCount,
        string memory jurisdictionCode,
        string memory tokenURI_
    ) external returns (uint256) {
        // Check jurisdiction compliance
        require(isJurisdictionPermitted(jurisdictionCode), "NeuraProof: Jurisdiction not permitted");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        // Generate verification hash
        bytes32 verificationHash = keccak256(abi.encodePacked(
            recipient,
            block.timestamp,
            averageMonthlyIncome,
            paymentFrequency,
            employerCount,
            tokenId
        ));
        
        // Store income proof data
        incomeProofs[tokenId] = IncomeProof({
            walletAddress: recipient,
            verificationTimestamp: block.timestamp,
            averageMonthlyIncome: averageMonthlyIncome,
            paymentFrequency: paymentFrequency,
            employerCount: employerCount,
            verificationHash: verificationHash,
            isValid: true
        });
        
        // Track wallet tokens
        walletTokens[recipient].push(tokenId);
        
        // Mint the NFT
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI_);
        
        emit IncomeProofMinted(tokenId, recipient, averageMonthlyIncome, employerCount, verificationHash);
        
        return tokenId;
    }
    
    /**
     * @dev Verify an income proof NFT (for third parties like lenders)
     */
    function verifyIncomeProof(uint256 tokenId) external view returns (
        bool isValid,
        address walletAddress,
        uint256 verificationTimestamp,
        uint256 averageMonthlyIncome,
        string memory paymentFrequency,
        uint256 employerCount,
        bytes32 verificationHash
    ) {
        require(_ownerOf(tokenId) != address(0), "NeuraProof: Token does not exist");
        
        IncomeProof memory proof = incomeProofs[tokenId];
        
        return (
            proof.isValid,
            proof.walletAddress,
            proof.verificationTimestamp,
            proof.averageMonthlyIncome,
            proof.paymentFrequency,
            proof.employerCount,
            proof.verificationHash
        );
    }
    
    /**
     * @dev Verify proof by verification hash
     */
    function verifyByHash(bytes32 hash) external view returns (bool exists, uint256 tokenId) {
        for (uint256 i = 0; i < _tokenIdCounter.current(); i++) {
            if (incomeProofs[i].verificationHash == hash) {
                return (true, i);
            }
        }
        return (false, 0);
    }
    
    /**
     * @dev Invalidate an income proof (admin only)
     */
    function invalidateProof(uint256 tokenId) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "NeuraProof: Token does not exist");
        incomeProofs[tokenId].isValid = false;
        emit ProofInvalidated(tokenId);
    }
    
    /**
     * @dev Get all tokens owned by a wallet
     */
    function getWalletTokens(address wallet) external view returns (uint256[] memory) {
        return walletTokens[wallet];
    }
    
    /**
     * @dev Toggle soulbound status
     */
    function setSoulbound(bool _isSoulbound) external onlyOwner {
        isSoulbound = _isSoulbound;
    }
    
    /**
     * @dev Override transfer to implement soulbound logic
     */
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        
        // Allow minting (from == address(0)) and burning (to == address(0))
        // Block transfers if soulbound
        if (isSoulbound && from != address(0) && to != address(0)) {
            revert("NeuraProof: Soulbound tokens cannot be transferred");
        }
        
        return super._update(to, tokenId, auth);
    }
    
    /**
     * @dev Get total supply
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    // Required overrides
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
