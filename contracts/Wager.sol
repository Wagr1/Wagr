pragma solidity ^0.4.18;

contract Wager {


  struct User {
    address accountNumber;
    bool side;
  }

  User[] public users;
  address public manager;

  uint public side1;
  uint public side2;

  mapping(address => bool) public alreadyBetting;


  function Wager() public {
      manager = msg.sender;
  }

  function joinBet(bool side) public payable {
      require(!alreadyBetting[msg.sender]);
      users.push(User({accountNumber: msg.sender, side: side}));
      alreadyBetting[msg.sender] = true;
      if (side) {
        side1++;
    }else {
        side2++;
      }
  }

  function payout(bool winningSide) public {
      require(msg.sender == manager);
      uint numberOfWinners;
      uint total = this.balance;
      if (winningSide) {
          numberOfWinners = side1;
      } else {
          numberOfWinners = side2;
      }
      for (uint i = 0; i < users.length; i++) {
          if (users[i].side == winningSide) {
              users[i].accountNumber.transfer(total/numberOfWinners);
          }
      }
  }

 function checkIfAlreadyInBet(address possiblePlayer)  public returns(bool) {
      return alreadyBetting[possiblePlayer];
  }

  function getUsersLength() public view returns(uint) {
    return users.length;
  }
}
