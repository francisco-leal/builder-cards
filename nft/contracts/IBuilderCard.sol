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
}
