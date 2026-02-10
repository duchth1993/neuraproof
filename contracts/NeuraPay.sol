// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NeuraPay
 * @dev Mock payroll contract for demonstrating income verification
 * @notice This simulates a payroll system that pays freelancers in USN tokens
 */
contract NeuraPay is Ownable {
    IERC20 public usnToken;
    
    struct PaymentRecord {
        address payer;
        address recipient;
        uint256 amount;
        uint256 timestamp;
        string memo;
    }
    
    // All payment records
    PaymentRecord[] public paymentHistory;
    
    // Mapping from recipient to their payment indices
    mapping(address => uint256[]) public recipientPayments;
    
    // Mapping from payer (employer) to their payment indices
    mapping(address => uint256[]) public payerPayments;
    
    // Registered employers
    mapping(address => bool) public registeredEmployers;
    address[] public employerList;
    
    // Events
    event PaymentMade(
        uint256 indexed paymentId,
        address indexed payer,
        address indexed recipient,
        uint256 amount,
        string memo
    );
    
    event EmployerRegistered(address indexed employer);
    
    constructor(address _usnToken) Ownable(msg.sender) {
        usnToken = IERC20(_usnToken);
    }
    
    /**
     * @dev Register as an employer
     */
    function registerAsEmployer() external {
        require(!registeredEmployers[msg.sender], "NeuraPay: Already registered");
        registeredEmployers[msg.sender] = true;
        employerList.push(msg.sender);
        emit EmployerRegistered(msg.sender);
    }
    
    /**
     * @dev Make a payment to a freelancer
     */
    function payFreelancer(
        address recipient,
        uint256 amount,
        string memory memo
    ) external {
        require(registeredEmployers[msg.sender], "NeuraPay: Not a registered employer");
        require(amount > 0, "NeuraPay: Amount must be greater than 0");
        
        // Transfer tokens
        require(usnToken.transferFrom(msg.sender, recipient, amount), "NeuraPay: Transfer failed");
        
        // Record payment
        uint256 paymentId = paymentHistory.length;
        paymentHistory.push(PaymentRecord({
            payer: msg.sender,
            recipient: recipient,
            amount: amount,
            timestamp: block.timestamp,
            memo: memo
        }));
        
        recipientPayments[recipient].push(paymentId);
        payerPayments[msg.sender].push(paymentId);
        
        emit PaymentMade(paymentId, msg.sender, recipient, amount, memo);
    }
    
    /**
     * @dev Get payment history for a recipient
     */
    function getRecipientPayments(address recipient) external view returns (PaymentRecord[] memory) {
        uint256[] memory indices = recipientPayments[recipient];
        PaymentRecord[] memory payments = new PaymentRecord[](indices.length);
        
        for (uint256 i = 0; i < indices.length; i++) {
            payments[i] = paymentHistory[indices[i]];
        }
        
        return payments;
    }
    
    /**
     * @dev Get payment count for a recipient
     */
    function getRecipientPaymentCount(address recipient) external view returns (uint256) {
        return recipientPayments[recipient].length;
    }
    
    /**
     * @dev Get unique employer count for a recipient
     */
    function getUniqueEmployerCount(address recipient) external view returns (uint256) {
        uint256[] memory indices = recipientPayments[recipient];
        address[] memory uniqueEmployers = new address[](indices.length);
        uint256 uniqueCount = 0;
        
        for (uint256 i = 0; i < indices.length; i++) {
            address payer = paymentHistory[indices[i]].payer;
            bool isUnique = true;
            
            for (uint256 j = 0; j < uniqueCount; j++) {
                if (uniqueEmployers[j] == payer) {
                    isUnique = false;
                    break;
                }
            }
            
            if (isUnique) {
                uniqueEmployers[uniqueCount] = payer;
                uniqueCount++;
            }
        }
        
        return uniqueCount;
    }
    
    /**
     * @dev Calculate total income for a recipient within a time window
     */
    function calculateTotalIncome(
        address recipient,
        uint256 fromTimestamp,
        uint256 toTimestamp
    ) external view returns (uint256 totalIncome, uint256 paymentCount) {
        uint256[] memory indices = recipientPayments[recipient];
        
        for (uint256 i = 0; i < indices.length; i++) {
            PaymentRecord memory payment = paymentHistory[indices[i]];
            if (payment.timestamp >= fromTimestamp && payment.timestamp <= toTimestamp) {
                totalIncome += payment.amount;
                paymentCount++;
            }
        }
        
        return (totalIncome, paymentCount);
    }
    
    /**
     * @dev Get all registered employers
     */
    function getEmployerList() external view returns (address[] memory) {
        return employerList;
    }
}
