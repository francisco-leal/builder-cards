// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";

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

    /**
     * @notice Mints/Creates an instance of the Builder Card for the Builder with address `_builder`. This instance is
     * attached to the `msg.sender`. Hence, the `msg.sender` is considered to be
     * the Collector of the Builder Card for the Builder given.
     * Also, it rewards the parties involved and pays fee to the platform hosting
     * the Builder Cards web application. Here is how reward is working:
     * - Builder is getting `BuilderCardBase->BUILDER_REWARD`.
     * - If the `msg.sender` is the first collector of the particular Builder Card,
     * they are being rewarded `BuilderCardBase->FIRST_COLLECTOR_REWARD`.
     * - Platform gets the rest, i.e. `COLLECTION_FEE - FIRST_COLLECTOR_REWARD(if they have been rewarded) - BUILDER_REWARD`.
     * Note, that the `msg.value` of the transaction needs to be (at least) `COLLECTION_FEE`. Otherwise,
     * the call will be reverted.
     * @dev
     * MUST revert, if the `msg.value` sent with this transaction is not enough to cover at least
     * for the `BuilderCardBase->COLLECTION_FEE`.
     * MUST NOT revert, if the collector (`msg.sender`) has already collected the given Builder
     * Card. It should just ignore and not emit the `CardCollected` event.
     * MUST emit the event `CardCollected` with `_builder` the given `_builder` and `_collector` the
     * `msg.sender`.
     * @param _builder the unique Builder identifier whose Card is collected.
     */
    function collect(address _builder) external payable;

    /**
     * @notice It returns the number of times a builder card has been collected. Hence, then number of times
     * the +collect(address)+ has been called for a given +address+.
     * @param _builder the unique builder identifier whose card is collected
     * @return _numberOfCollections a +uint256+ which is the number of collections for the given builder.
     */
    function balanceFor(
        address _builder
    ) external view returns (uint256 _numberOfCollections);

    /**
     * @return the total collections
     */
    function balanceFor() external view returns (uint256);

    /**
     * @notice It returns the number of times a collector has collected a
     * BuilderCard. It wraps the +balanceOf+ ERC-1155 standard function that
     * takes as input the token as +uint256+.
     * @param _owner the address that owns the Builder Cards, i.e. the tokens
     * @param _builder the address representing the Builder Card
     */
    function balanceOf(
        address _owner,
        address _builder
    ) external view returns (uint256);

    /**
     * @notice It returns the number of Builder Cards a specific collector
     * has collected so far.
     * @param _owner the address whose collections we want to count
     * @return 0 or more, depending on how many Builder Cards the specific
     * owner/collector has collected.
     */
    function balanceOf(address _owner) external view returns (uint256);

    /**
     * @notice It withdraws an amount of eth from the smart contract and
     * sends it to the contract owner address. It should be called only
     * by the contract owner.
     * @param _amount the amount to withdraw
     */
    function withDraw(uint256 _amount) external;

    /**
     *
     * @param _account the account of which earnings are to be returned
     */
    function earnings(address _account) external view returns (uint256);

    /**
     * @notice This should only be called by the contract owner.
     * @dev It must revert if the collection fee is 0.
     * It must revert if the sum of the builder reward and the first collector reward
     * is greater than or equal to the collection fee. We want the platform to get some
     * reward.
     * @param _collectionFee The Collection Fee that should be sent as value on collect()
     * @param _builderReward The amount of the Collection Fee that goes to the builder
     * @param _firstCollectorReward The amount of the Collection Fee that goes to the first collector
     */
    function setChargingPolicy(
        uint256 _collectionFee,
        uint256 _builderReward,
        uint256 _firstCollectorReward
    ) external;

    /**
     * @return _collectionFee
     */
    function getCollectionFee() external view returns (uint256 _collectionFee);

    /**
     * @return _builderReward
     */
    function getBuilderReward() external view returns (uint256 _builderReward);

    /**
     * @return _firstCollectorReward
     */
    function getFirstCollectorReward()
        external
        view
        returns (uint256 _firstCollectorReward);
}
