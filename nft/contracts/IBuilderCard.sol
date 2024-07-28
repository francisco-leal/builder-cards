// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract BuilderCardBase {
    uint256 public constant TOTAL_COLLECTION_FEE = 0.001 ether;
    uint256 constant BUILDER_REWARD = 0.0005 ether;
    uint256 public constant FIRST_COLLECTOR_REWARD = 0.0003 ether;

    constructor() {}
}

/**
 * @title IBuilderCard Builder Card Collections
 * @author Panagiotis Matsinopoulos & Francisco Leal
 * @notice The API BuilderCard contract exposes
 */
interface IBuilderCard {
    /**
     * @notice It is emitted when a Builder Card is actually collected.
     * @param _builder It is the Builder address/wallet the Card was collected for
     * @param _collector It is the address of the collector
     */
    event CardCollected(address indexed _builder, address indexed _collector);

    /// >>>>>>>>>>>>>>>>>>>>>>> ERC-1155 defined events >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    /**
        @dev Either `TransferSingle` or `TransferBatch` MUST emit when tokens are transferred, including zero value transfers as well as minting or burning (see "Safe Transfer Rules" section of the standard).
        The `_operator` argument MUST be the address of an account/contract that is approved to make the transfer (SHOULD be msg.sender).
        The `_from` argument MUST be the address of the holder whose balance is decreased.
        The `_to` argument MUST be the address of the recipient whose balance is increased.
        The `_id` argument MUST be the token type being transferred.
        The `_value` argument MUST be the number of tokens the holder balance is decreased by and match what the recipient balance is increased by.
        When minting/creating tokens, the `_from` argument MUST be set to `0x0` (i.e. zero address).
        When burning/destroying tokens, the `_to` argument MUST be set to `0x0` (i.e. zero address).
    */
    event TransferSingle(
        address indexed _operator,
        address indexed _from,
        address indexed _to,
        uint256 _id,
        uint256 _value
    );

    /**
        @dev Either `TransferSingle` or `TransferBatch` MUST emit when tokens are transferred, including zero value transfers as well as minting or burning (see "Safe Transfer Rules" section of the standard).
        The `_operator` argument MUST be the address of an account/contract that is approved to make the transfer (SHOULD be msg.sender).
        The `_from` argument MUST be the address of the holder whose balance is decreased.
        The `_to` argument MUST be the address of the recipient whose balance is increased.
        The `_ids` argument MUST be the list of tokens being transferred.
        The `_values` argument MUST be the list of number of tokens (matching the list and order of tokens specified in _ids) the holder balance is decreased by and match what the recipient balance is increased by.
        When minting/creating tokens, the `_from` argument MUST be set to `0x0` (i.e. zero address).
        When burning/destroying tokens, the `_to` argument MUST be set to `0x0` (i.e. zero address).
    */
    event TransferBatch(
        address indexed _operator,
        address indexed _from,
        address indexed _to,
        uint256[] _ids,
        uint256[] _values
    );

    /**
        @dev MUST emit when approval for a second party/operator address to manage all tokens for an owner address is enabled or disabled (absence of an event assumes disabled).
    */
    event ApprovalForAll(
        address indexed _owner,
        address indexed _operator,
        bool _approved
    );

    /**
        @dev MUST emit when the URI is updated for a token ID.
        URIs are defined in RFC 3986.
        The URI MUST point to a JSON file that conforms to the "ERC-1155 Metadata URI JSON Schema".
    */
    event URI(string _value, uint256 indexed _id);

    /// <<<<<<<<<<<<<<<<< end of ERC-1155 Events <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    /**
     * @notice Mints/Creates an instance of the Builder Card for the Builder with address `_builder`. This instance is
     * attached to the `msg.sender`. Hence, the `msg.sender` is considered to be
     * the Collector of the Builder Card for the Builder given.
     * Also, it rewards the parties involved and pays fee to the platform hosting
     * the Builder Cards web application. Here is how reward is working:
     * - Builder is getting `BuilderCardBase->BUILDER_REWARD`.
     * - If the `msg.sender` is the first collector of the particular Builder Card,
     * they are being rewarded `BuilderCardBase->FIRST_COLLECTOR_REWARD`.
     * - Platform gets the rest, i.e. `TOTAL_COLLECTION_FEE - FIRST_COLLECTOR_REWARD(if they have been rewarded) - BUILDER_REWARD`.
     * Note, that the `msg.value` of the transaction needs to be (at least) `TOTAL_COLLECTION_FEE`. Otherwise,
     * the call will be reverted.
     * @dev
     * MUST revert, if the `msg.value` sent with this transaction is not enough to cover at least
     * for the `BuilderCardBase->TOTAL_COLLECTION_FEE`.
     * MUST NOT revert, if the collector (`msg.sender`) has already collected the given Builder
     * Card. It should just ignore and not emit the `CardCollected` event.
     * MUST emit the event `CardCollected` with `_builder` the given `_builder` and `_collector` the
     * `msg.sender`.
     * @param _builder the unique Builder identifier whose Card is collected.
     */
    function collect(address _builder) external payable;

    /// >>>>>>>>>>>>>>>>>>>>>>>> ERC-1155 functions >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    /**
        @notice Transfers `_value` amount of an `_id` from the `_from` address to the `_to` address specified (with safety call).
        @dev Caller must be approved to manage the tokens being transferred out of the `_from` account (see "Approval" section of the standard).
        MUST revert if `_to` is the zero address.
        MUST revert if balance of holder for token `_id` is lower than the `_value` sent.
        MUST revert on any other error.
        MUST emit the `TransferSingle` event to reflect the balance change (see "Safe Transfer Rules" section of the standard).
        After the above conditions are met, this function MUST check if `_to` is a smart contract (e.g. code size > 0). If so, it MUST call `onERC1155Received` on `_to` and act appropriately (see "Safe Transfer Rules" section of the standard).
        @param _from    Source address
        @param _to      Target address
        @param _id      ID of the token type
        @param _value   Transfer amount
        @param _data    Additional data with no specified format, MUST be sent unaltered in call to `onERC1155Received` on `_to`
    */
    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _id,
        uint256 _value,
        bytes calldata _data
    ) external;

    /**
        @notice Transfers `_values` amount(s) of `_ids` from the `_from` address to the `_to` address specified (with safety call).
        @dev Caller must be approved to manage the tokens being transferred out of the `_from` account (see "Approval" section of the standard).
        MUST revert if `_to` is the zero address.
        MUST revert if length of `_ids` is not the same as length of `_values`.
        MUST revert if any of the balance(s) of the holder(s) for token(s) in `_ids` is lower than the respective amount(s) in `_values` sent to the recipient.
        MUST revert on any other error.
        MUST emit `TransferSingle` or `TransferBatch` event(s) such that all the balance changes are reflected (see "Safe Transfer Rules" section of the standard).
        Balance changes and events MUST follow the ordering of the arrays (_ids[0]/_values[0] before _ids[1]/_values[1], etc).
        After the above conditions for the transfer(s) in the batch are met, this function MUST check if `_to` is a smart contract (e.g. code size > 0). If so, it MUST call the relevant `ERC1155TokenReceiver` hook(s) on `_to` and act appropriately (see "Safe Transfer Rules" section of the standard).
        @param _from    Source address
        @param _to      Target address
        @param _ids     IDs of each token type (order and length must match _values array)
        @param _values  Transfer amounts per token type (order and length must match _ids array)
        @param _data    Additional data with no specified format, MUST be sent unaltered in call to the `ERC1155TokenReceiver` hook(s) on `_to`
    */
    function safeBatchTransferFrom(
        address _from,
        address _to,
        uint256[] calldata _ids,
        uint256[] calldata _values,
        bytes calldata _data
    ) external;

    /**
        @notice Get the balance of an account's tokens.
        @param _owner  The address of the token holder
        @param _id     ID of the token
        @return        The _owner's balance of the token type requested
     */
    function balanceOf(
        address _owner,
        uint256 _id
    ) external view returns (uint256);

    /**
        @notice Get the balance of multiple account/token pairs
        @param _owners The addresses of the token holders
        @param _ids    ID of the tokens
        @return        The _owner's balance of the token types requested (i.e. balance for each (owner, id) pair)
     */
    function balanceOfBatch(
        address[] calldata _owners,
        uint256[] calldata _ids
    ) external view returns (uint256[] memory);

    /**
        @notice Enable or disable approval for a third party ("operator") to manage all of the caller's tokens.
        @dev MUST emit the ApprovalForAll event on success.
        @param _operator  Address to add to the set of authorized operators
        @param _approved  True if the operator is approved, false to revoke approval
    */
    function setApprovalForAll(address _operator, bool _approved) external;

    /**
        @notice Queries the approval status of an operator for a given owner.
        @param _owner     The owner of the tokens
        @param _operator  Address of authorized operator
        @return           True if the operator is approved, false if not
    */
    function isApprovedForAll(
        address _owner,
        address _operator
    ) external view returns (bool);

    /// <<<<<<<<<<<<<<<<<<<<<< end of ERC-1155 defined functtions <<<<<<<<<<<<<<<<<<<<<<<<<<<<

    /// >>>>>>>>>>>>>>>>>>>>>> ERC-1155 MetaData URI defined functions >>>>>>>>>>>>>>>>>>>>>>>

    /**
        @notice A distinct Uniform Resource Identifier (URI) for a given token.
        @dev URIs are defined in RFC 3986.
        The URI MUST point to a JSON file that conforms to the "ERC-1155 Metadata URI JSON Schema".
        @return URI string
    */
    function uri(uint256 _id) external view returns (string memory);

    /// <<<<<<<<<<<<<<<<<<<< end of ERC 1155 MetaData URI <<<<<<<<<<<<<<<<<<<<<<<<<<<<

    /// >>>>>>>>>>>>>>>>>>>> start of ERC-165 defined methods >>>>>>>>>>>>>>>>>>>>>>>>

    /**
     * @dev MUST return the constant value `true` if `0xd9b67a26` is passed through
     * the `interfaceID` argument. This is for Interface ERC-1155.
     * MUST return the constant value `true` if `0x0e89341c` for supportt
     * of ERC1155Metadata_URI extension.
     */
    function supportsInterface(bytes4 interfaceID) external view returns (bool);

    /// <<<<<<<<<<<<<<<<<<<<<< end of ERC-165 defined functtions <<<<<<<<<<<<<<<<<<<<<
}
