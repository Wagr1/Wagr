pragma solidity ^0.4.17;

contract Mafia {

  struct Player {
    address gamePlayer;
    bool mafia;
  }

  Player[] public players;
  uint public villagerMembers;
  uint public mafiaMembers;

  address public manager;

  mapping(address => bool) public alreadyPlaying;


  function Mafia() public {
      manager = msg.sender;
  }

  function addPlayer(address currentPlayer, bool isMafia) public payable {
      //require(!alreadyPlaying[currentPlayer]);
      //require(msg.value == 1 ether);
      players.push(Player({gamePlayer: currentPlayer, mafia: isMafia}));
      alreadyPlaying[currentPlayer] = true;
      if (isMafia) {
        mafiaMembers++;
    }else {
        villagerMembers++;
      }
  }

  function payout(bool isWinningTeamMafia) public {
      require(msg.sender == manager);
      uint numberOfWinners;
      uint total = this.balance;
      if (isWinningTeamMafia) {
          numberOfWinners = mafiaMembers;
      } else {
          numberOfWinners = villagerMembers;
      }
      for (uint i = 0; i < players.length; i++) {
          if (players[i].mafia == isWinningTeamMafia) {
              players[i].gamePlayer.transfer(total/numberOfWinners);
          }
      //players = new Player[](0);
      //Player storage players = [](0);
      }
  }

  function checkIfAlreadyInGame(address possiblePlayer)  public returns(bool) {
      return alreadyPlaying[possiblePlayer];
  }

  function getPlayersLength() public view returns(uint) {
    return players.length;
  }
}
