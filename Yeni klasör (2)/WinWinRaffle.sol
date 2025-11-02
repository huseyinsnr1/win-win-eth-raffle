// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title WinWinRaffle
 * @dev A decentralized ETH raffle system on BASE network and Ethereum Sepolia testnet
 * @notice This contract manages lottery rounds with automated prize distribution
 */
contract WinWinRaffle is Ownable, ReentrancyGuard, Pausable {
    
    // Structs
    struct Round {
        uint256 roundId;
        uint256 startTime;
        uint256 endTime;
        uint256 totalPool;
        uint256 ticketsSold;
        address winner;
        bool distributed;
    }

    struct Ticket {
        address player;
        uint256 ticketNumber;
        uint256 roundId;
    }

    // State Variables
    uint256 public currentRoundId;
    uint256 public ticketPrice;
    uint256 public maxTicketsPerRound;
    uint256 public roundDuration;
    
    mapping(uint256 => Round) public rounds;
    mapping(uint256 => Ticket[]) public roundTickets;
    mapping(address => uint256[]) public playerTickets;
    mapping(uint256 => mapping(address => uint256)) public playerTicketCount;
    
    // Events
    event RoundStarted(uint256 indexed roundId, uint256 startTime, uint256 endTime);
    event TicketPurchased(address indexed player, uint256 indexed roundId, uint256 ticketNumber, uint256 amount);
    event RoundEnded(uint256 indexed roundId, address indexed winner, uint256 prizeAmount);
    event PrizeDistributed(uint256 indexed roundId, address indexed winner, uint256 amount);
    event TicketPriceUpdated(uint256 oldPrice, uint256 newPrice);
    event MaxTicketsUpdated(uint256 oldMax, uint256 newMax);
    event RoundDurationUpdated(uint256 oldDuration, uint256 newDuration);

    /**
     * @dev Constructor initializes the raffle with default parameters
     * @param _ticketPrice Initial ticket price in wei
     * @param _maxTicketsPerRound Maximum tickets allowed per round
     * @param _roundDuration Duration of each round in seconds
     */
    constructor(
        uint256 _ticketPrice,
        uint256 _maxTicketsPerRound,
        uint256 _roundDuration
    ) Ownable(msg.sender) {
        require(_ticketPrice > 0, "Ticket price must be greater than 0");
        require(_maxTicketsPerRound > 0, "Max tickets must be greater than 0");
        require(_roundDuration > 0, "Round duration must be greater than 0");
        
        ticketPrice = _ticketPrice;
        maxTicketsPerRound = _maxTicketsPerRound;
        roundDuration = _roundDuration;
        currentRoundId = 0;
    }

    /**
     * @dev Start a new raffle round
     * @notice Only owner can start a new round
     */
    function startRound() external onlyOwner whenNotPaused {
        require(
            currentRoundId == 0 || rounds[currentRoundId].distributed,
            "Previous round must be completed"
        );

        currentRoundId++;
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + roundDuration;

        rounds[currentRoundId] = Round({
            roundId: currentRoundId,
            startTime: startTime,
            endTime: endTime,
            totalPool: 0,
            ticketsSold: 0,
            winner: address(0),
            distributed: false
        });

        emit RoundStarted(currentRoundId, startTime, endTime);
    }

    /**
     * @dev Purchase tickets for the current round
     * @param _numberOfTickets Number of tickets to purchase
     */
    function buyTickets(uint256 _numberOfTickets) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
    {
        require(currentRoundId > 0, "No active round");
        require(_numberOfTickets > 0, "Must buy at least 1 ticket");
        require(block.timestamp < rounds[currentRoundId].endTime, "Round has ended");
        require(
            rounds[currentRoundId].ticketsSold + _numberOfTickets <= maxTicketsPerRound,
            "Exceeds max tickets for round"
        );
        require(msg.value == ticketPrice * _numberOfTickets, "Incorrect ETH amount");

        Round storage round = rounds[currentRoundId];

        for (uint256 i = 0; i < _numberOfTickets; i++) {
            uint256 ticketNumber = round.ticketsSold + i + 1;
            
            roundTickets[currentRoundId].push(Ticket({
                player: msg.sender,
                ticketNumber: ticketNumber,
                roundId: currentRoundId
            }));

            playerTickets[msg.sender].push(ticketNumber);
        }

        round.ticketsSold += _numberOfTickets;
        round.totalPool += msg.value;
        playerTicketCount[currentRoundId][msg.sender] += _numberOfTickets;

        emit TicketPurchased(msg.sender, currentRoundId, round.ticketsSold, msg.value);
    }

    /**
     * @dev End the current round and select a winner
     * @notice Only owner can end a round after duration expires
     */
    function endRound() external onlyOwner nonReentrant {
        require(currentRoundId > 0, "No active round");
        Round storage round = rounds[currentRoundId];
        require(block.timestamp >= round.endTime, "Round has not ended yet");
        require(round.winner == address(0), "Winner already selected");

        if (round.ticketsSold == 0) {
            round.distributed = true;
            emit RoundEnded(currentRoundId, address(0), 0);
            return;
        }

        // Generate pseudo-random winner
        uint256 winningTicket = (uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            block.number,
            msg.sender
        ))) % round.ticketsSold) + 1;

        address winner = roundTickets[currentRoundId][winningTicket - 1].player;
        round.winner = winner;

        emit RoundEnded(currentRoundId, winner, round.totalPool);
    }

    /**
     * @dev Distribute prize to the winner
     * @notice Only owner can trigger prize distribution
     */
    function distributePrize() external onlyOwner nonReentrant {
        require(currentRoundId > 0, "No active round");
        Round storage round = rounds[currentRoundId];
        require(round.winner != address(0), "Winner not selected");
        require(!round.distributed, "Prize already distributed");

        uint256 prizeAmount = round.totalPool;
        round.distributed = true;

        (bool success, ) = payable(round.winner).call{value: prizeAmount}("");
        require(success, "Prize transfer failed");

        emit PrizeDistributed(currentRoundId, round.winner, prizeAmount);
    }

    /**
     * @dev Set ticket price
     * @param _newPrice New ticket price in wei
     */
    function setTicketPrice(uint256 _newPrice) external onlyOwner {
        require(_newPrice > 0, "Price must be greater than 0");
        uint256 oldPrice = ticketPrice;
        ticketPrice = _newPrice;
        emit TicketPriceUpdated(oldPrice, _newPrice);
    }

    /**
     * @dev Set maximum tickets per round
     * @param _newMax New maximum tickets
     */
    function setMaxTickets(uint256 _newMax) external onlyOwner {
        require(_newMax > 0, "Max must be greater than 0");
        uint256 oldMax = maxTicketsPerRound;
        maxTicketsPerRound = _newMax;
        emit MaxTicketsUpdated(oldMax, _newMax);
    }

    /**
     * @dev Set round duration
     * @param _newDuration New duration in seconds
     */
    function setRoundDuration(uint256 _newDuration) external onlyOwner {
        require(_newDuration > 0, "Duration must be greater than 0");
        uint256 oldDuration = roundDuration;
        roundDuration = _newDuration;
        emit RoundDurationUpdated(oldDuration, _newDuration);
    }

    /**
     * @dev Pause the raffle
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause the raffle
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Get current round details
     */
    function getCurrentRound() external view returns (Round memory) {
        require(currentRoundId > 0, "No active round");
        return rounds[currentRoundId];
    }

    /**
     * @dev Get round tickets
     * @param _roundId Round ID
     */
    function getRoundTickets(uint256 _roundId) external view returns (Ticket[] memory) {
        return roundTickets[_roundId];
    }

    /**
     * @dev Get player tickets for current round
     * @param _player Player address
     */
    function getPlayerTicketCount(address _player) external view returns (uint256) {
        return playerTicketCount[currentRoundId][_player];
    }

    /**
     * @dev Emergency withdraw (only if no active round)
     */
    function emergencyWithdraw() external onlyOwner {
        require(
            currentRoundId == 0 || rounds[currentRoundId].distributed,
            "Cannot withdraw during active round"
        );
        
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdraw failed");
    }

    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {}
}
