// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract BuilderCardBase {
    uint256 public constant TOTAL_COLLECTION_FEE = 0.001 ether;

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
     * @param _id It is the Builder identifier the Card was collected for
     * @param _collector It is the address of the collector
     */
    event CardCollected(uint256 indexed _id, address indexed _collector);

    /**
     * @notice Mints/Creates an instance of the Builder Card for the Builder with id `_id`. This instance is
     * attached to the `msg.sender`. Hence, the `msg.sender` is considered to be
     * the Collector of the Builder Card for the Builder given.
     * @dev
     * MUST revert, if the `msg.value` sent with this transaction is not enough to cover at least
     * for the `BuilderCardBase->TOTAL_COLLECTION_FEE`.
     * MUST NOT revert, if the collector (`msg.sender`) has already collected the given Builder
     * Card. It should just ignore and not emit the `CardCollected` event.
     * MUST emit the event `CardCollected` with `_id` the given `_id` and `_collector` the
     * `msg.sender`.
     * @param _id the unique Builder identifier whose Card is collected.
     */
    function collect(uint256 _id) external payable;
}
