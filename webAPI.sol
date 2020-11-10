pragma solidity >=0.4.22 <0.6.0;

contract webapi {

    struct LocationData {
        string data;
        bool isValue;
    }

    struct GasData {
        string data;
        bool isValue;
    }

    struct SpecialEventData {
        string data;
        bool isValue;
    }

    mapping (string => LocationData) AllLocationData;

    mapping (string => GasData) AllGasData;

    mapping (string => SpecialEventData) AllSpecialEventData;

    function SetLocationData(string memory _id, string memory _data) public {
        require(AllLocationData[_id].isValue == false, "ID is already in use (Smart Contract)");
        AllLocationData[_id].isValue = true;
        AllLocationData[_id].data = _data;
    }

    function GetLocationData(string memory _id) public view returns (string memory) {
        return (AllLocationData[_id].data);
    }

    function SetGasData(string memory _id, string memory _data) public {
        require(AllGasData[_id].isValue == false, "ID is already in use (Smart Contract)");
        AllGasData[_id].isValue = true;
        AllGasData[_id].data = _data;
    }

    function GetGasData(string memory _id) public view returns (string memory) {
        return (AllGasData[_id].data);
    }

    function SetSpecialEventData(string memory _id, string memory _data) public {
        require(AllSpecialEventData[_id].isValue == false, "ID is already in use (Smart Contract)");
        AllSpecialEventData[_id].isValue = true;
        AllSpecialEventData[_id].data = _data;
    }

    function GetSpecialEventData(string memory _id) public view returns (string memory) {
        return (AllSpecialEventData[_id].data);
    }
}
