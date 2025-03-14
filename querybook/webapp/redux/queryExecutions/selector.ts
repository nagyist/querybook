import { createSelector } from 'reselect';

import { IQueryExecution, IQueryReview } from 'const/queryExecution';
import { IStoreState } from 'redux/store/types';

const queryExecutionIdSetSelector = (state: IStoreState, cellId: number) =>
    cellId in state.queryExecutions.dataCellIdQueryExecution
        ? state.queryExecutions.dataCellIdQueryExecution[cellId]
        : null;

export const queryExecutionByIdSelector = (state: IStoreState) =>
    state.queryExecutions.queryExecutionById;

export const makeQueryExecutionsSelector = () => {
    const queryExecutionIdsSelector = createSelector(
        queryExecutionIdSetSelector,
        (idSet) => (idSet != null ? [...idSet] : [])
    );
    return createSelector(
        queryExecutionIdsSelector,
        queryExecutionByIdSelector,
        (queryExecutionIds, queryExecutionById) =>
            queryExecutionIds
                .sort((a, b) => b - a)
                .map((queryExecutionId) => queryExecutionById[queryExecutionId])
                .filter((q) => q)
    );
};

export const dataCellIdQueryExecutionSelector = (
    state: IStoreState,
    cellId: number
) => state.queryExecutions.dataCellIdQueryExecution[cellId];

// returns array of query execution ids
export const dataCellIdQueryExecutionArraySelector = createSelector(
    dataCellIdQueryExecutionSelector,
    (dataCellIdQueryExecutionSet) =>
        (dataCellIdQueryExecutionSet &&
            Array.from(dataCellIdQueryExecutionSet).sort((a, b) => b - a)) ||
        undefined
);

export const queryExecutionSelector = (
    state: IStoreState,
    executionId: number
) => state.queryExecutions.queryExecutionById[executionId] as IQueryExecution;

export const queryReviewByExecutionIdSelector = (
    state: IStoreState,
    queryExecutionId: number | null
): IQueryReview => {
    if (queryExecutionId == null) {
        return null;
    }
    return state.queryExecutions.queryReviewByExecutionId[queryExecutionId];
};

// returns array of query statement ids
export const makeQueryExecutionStatementExecutionSelector = () =>
    createSelector(
        queryExecutionSelector,
        (queryExecution) =>
            (queryExecution && queryExecution.statement_executions) || undefined
    );

export const makeStatementExecutionsSelector = () =>
    createSelector(
        queryExecutionSelector,
        (state) => state.queryExecutions.statementExecutionById,
        (queryExecution, statementExecutionById) =>
            queryExecution?.statement_executions?.map(
                (id) => statementExecutionById[id]
            ) ?? []
    );

const viewersByExecutionIdUidSelector = (state: IStoreState) =>
    state.queryExecutions.viewersByExecutionIdUserId;

const accessRequestsByExecutionIdUidSelector = (state: IStoreState) =>
    state.queryExecutions.accessRequestsByExecutionIdUserId;

export const queryExecutionAccessRequestsByUidSelector = createSelector(
    queryExecutionSelector,
    accessRequestsByExecutionIdUidSelector,
    (queryExecution, accessRequestsByExecutionIdUid) =>
        queryExecution &&
        accessRequestsByExecutionIdUid &&
        queryExecution.id in accessRequestsByExecutionIdUid
            ? accessRequestsByExecutionIdUid[queryExecution.id]
            : {}
);

export const queryExecutionViewersByUidSelector = createSelector(
    queryExecutionSelector,
    viewersByExecutionIdUidSelector,
    (queryExecution, viewersByExecutionIdUid) =>
        viewersByExecutionIdUid &&
        queryExecution &&
        queryExecution.id in viewersByExecutionIdUid
            ? viewersByExecutionIdUid[queryExecution.id]
            : {}
);

const latestQueryExecutionIdsPerCellSelector = (
    state: IStoreState,
    cellIds: number[]
) =>
    cellIds
        .map((cellId) => {
            const executions =
                state.queryExecutions.dataCellIdQueryExecution[cellId] ?? [];
            return Math.max(...executions);
        })
        .filter(Boolean);

/**
 * By given a list of query cell ids, this selector will return the latest
 * query execution of each query cell in an array. The order may be different
 * from the order of the input query cell ids.
 */
export const makeLatestQueryExecutionsSelector = () =>
    createSelector(
        latestQueryExecutionIdsPerCellSelector,
        queryExecutionByIdSelector,
        (queryExecutionIds, queryExecutionById) =>
            queryExecutionIds
                .map((queryExecutionId) => queryExecutionById[queryExecutionId])
                .filter((q) => q)
    );
