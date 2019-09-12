import { SortExecutor, FilterExecutor } from "../core/transformExecutors";
import { DataGenerator } from './testUtils';
import { ViewBasedJSONModel } from "../core/viewbasedjsonmodel";
import { ReadonlyJSONValue } from '@phosphor/coreutils';
import { Transform } from "../core/transform";

const sortTestCases: Private.SortTestCase[] = [
  // Number
  { desc: true, dType: 'number', data: [2, 1, 3], expected: [3, 2, 1] },
  { desc: false, dType: 'number', data: [2, 1, 3], expected: [1, 2, 3] },
  // String
  { desc: true, dType: 'string', data: ['A', 'C', 'B'], expected: ['C', 'B', 'A'] },
  { desc: false, dType: 'string', data: ['A', 'C', 'B'], expected: ['A', 'B', 'C'] },
  // Boolean
  { desc: true, dType: 'boolean', data: [true, false, true], expected: [true, true, false] },
  { desc: false, dType: 'boolean', data: [true, false, true], expected: [false, true, true] },
  // Datetime
  { desc: true, dType: 'datetime', data: ['2019-09-12T18:38:47.431Z', '2019-09-07T18:38:47.431Z', '2019-09-10T18:38:47.431Z'], expected: ['2019-09-12T18:38:47.431Z', '2019-09-10T18:38:47.431Z', '2019-09-07T18:38:47.431Z'] },
  { desc: false, dType: 'daterime', data: ['2019-09-12T18:38:47.431Z', '2019-09-07T18:38:47.431Z', '2019-09-10T18:38:47.431Z'], expected: ['2019-09-07T18:38:47.431Z', '2019-09-10T18:38:47.431Z', '2019-09-12T18:38:47.431Z'] },
];

// Run tests
describe('Sort Executors', () => {
  for (let testCase of sortTestCases) {
    test(`sort-${testCase.dType}-${testCase.desc ? 'desc' : 'asc'}`, () => {
      const testData = DataGenerator.createTestData({
        name: 'test', type: testCase.dType, data: testCase.data
      });
      const result = Private.executeSort({
        field: 'test',
        desc: testCase.desc,
        dType: testCase.dType,
        data: testData,
      })
      expect(result).toEqual(testCase.expected)
    });
  }
})

const filterTestCases: Private.FilterTestCase[] = [
  // Number
  { op: '<', value: 10, dType: 'number', data: [5, 10, 15], expected: [5] },
  { op: '>', value: 10, dType: 'number', data: [5, 10, 15], expected: [15] },
  { op: '<=', value: 10, dType: 'number', data: [5, 10, 15], expected: [5, 10] },
  { op: '>=', value: 10, dType: 'number', data: [5, 10, 15], expected: [10, 15] },
  { op: 'empty', value: null, dType: 'number', data: [5, null, 15], expected: [null] },
  { op: 'notempty', value: null, dType: 'number', data: [5, null, 15], expected: [5, 15] },
  { op: 'in', value: [5, 10], dType: 'number', data: [5, 10, 15], expected: [5, 10] },
  { op: 'between', value: [7, 12], dType: 'number', data: [5, 10, 15], expected: [10] },
  // String
  { op: '<', value: 'b', dType: 'string', data: ['a', 'b', 'c'], expected: ['a'] },
  { op: '>', value: 'b', dType: 'string', data: ['a', 'b', 'c'], expected: ['c'] },
  { op: 'empty', value: null, dType: 'string', data: ['a', null, 'c'], expected: [null] },
  { op: 'notempty', value: null, dType: 'string', data: ['a', null, 'c'], expected: ['a', 'c'] },
  { op: 'in', value: ['a', 'b'], dType: 'string', data: ['a', 'b', 'c'], expected: ['a', 'b'] },
  { op: 'between', value: ['a', 'e'], dType: 'string', data: ['a', 'b', 'c', 'd', 'e'], expected: ['b', 'c', 'd'] },
  { op: 'startswith', value: 'a', dType: 'string', data: ['ab', 'ba', 'ca'], expected: ['ab'] },
  { op: 'endswith', value: 'a', dType: 'string', data: ['ab', 'ba', 'ca'], expected: ['ba', 'ca'] },
  { op: 'contains', value: 'rr', dType: 'string', data: ['apple', 'berry', 'cherry'], expected: ['berry', 'cherry'] },
  { op: '!contains', value: 'rr', dType: 'string', data: ['apple', 'berry', 'cherry'], expected: ['apple'] },
  // Boolean
  { op: 'empty', value: null, dType: 'boolean', data: [true, null, false], expected: [null] },
  { op: 'notempty', value: null, dType: 'boolean', data: [true, null, false], expected: [true, false] },
  // Datetime
  { op: '<', value: '2019-09-11', dType: 'datetime', data: ['2019-09-10T18:38:47.431Z', '2019-09-11T18:38:47.431Z', '2019-09-12T18:38:47.431Z'], expected: ['2019-09-10T18:38:47.431Z'] },
  { op: '>', value: '2019-09-11', dType: 'datetime', data: ['2019-09-10T18:38:47.431Z', '2019-09-11T18:38:47.431Z', '2019-09-12T18:38:47.431Z'], expected: ['2019-09-12T18:38:47.431Z'] },
  { op: '<=', value: '2019-09-11', dType: 'datetime', data: ['2019-09-10T18:38:47.431Z', '2019-09-11T18:38:47.431Z', '2019-09-12T18:38:47.431Z'], expected: ['2019-09-10T18:38:47.431Z', '2019-09-11T18:38:47.431Z'] },
  { op: '>=', value: '2019-09-11', dType: 'datetime', data: ['2019-09-10T18:38:47.431Z', '2019-09-11T18:38:47.431Z', '2019-09-12T18:38:47.431Z'], expected: ['2019-09-11T18:38:47.431Z', '2019-09-12T18:38:47.431Z'] },
  { op: 'empty', value: null, dType: 'datetime', data: ['2019-09-10T18:38:47.431Z', null, '2019-09-12T18:38:47.431Z'], expected: [null] },
  { op: 'notempty', value: null, dType: 'datetime', data: ['2019-09-10T18:38:47.431Z', null, '2019-09-12T18:38:47.431Z'], expected: ['2019-09-10T18:38:47.431Z', '2019-09-12T18:38:47.431Z'] },
  { op: 'in', value: ['2019-09-10T18:38:47.431Z', '2019-09-12T18:38:47.431Z'], dType: 'datetime', data: ['2019-09-10T18:38:47.431Z', '2019-09-11T18:38:47.431Z', '2019-09-12T18:38:47.431Z'], expected: ['2019-09-10T18:38:47.431Z', '2019-09-12T18:38:47.431Z'] },
  { op: 'between', value: ['2019-09-02T18:38:47.431Z', '2019-09-04T18:38:47.431Z'], dType: 'datetime', data: ['2019-09-01T18:38:47.431Z', '2019-09-03T18:38:47.431Z', '2019-09-06T18:38:47.431Z'], expected: ['2019-09-03T18:38:47.431Z'] },
  { op: '=', value: '2019-09-10T18:38:47.431Z', dType: 'datetime', data: ['2019-09-10T11:38:47.431Z', '2019-09-10T18:38:47.431Z', '2019-09-10T12:38:47.431Z'], expected: ['2019-09-10T18:38:47.431Z'] },
  { op: 'isOnSameDay', value: '2019-09-10', dType: 'datetime', data: ['2019-09-10T11:38:47.431Z', '2019-09-10T18:38:47.431Z', '2019-09-12T12:38:47.431Z'], expected: ['2019-09-10T11:38:47.431Z', '2019-09-10T18:38:47.431Z'] },
];

// Run tests
describe('Filter Executors', () => {
  for (let testCase of filterTestCases) {
    test(`filter-${testCase.dType}-${testCase.op}`, () => {
      const testData = DataGenerator.createTestData({
        name: 'test', type: testCase.dType, data: testCase.data
      });
      const result = Private.executeFilter({
        field: 'test',
        dType: testCase.dType,
        data: testData,
        operator: testCase.op,
        value: testCase.value
      });
      expect(result).toEqual(testCase.expected)
    });
  }
})

/**
 * The namespace for the module implementation details.
 */
namespace Private {
  /**
   * Returns an array containing the data from a single column of the provided
   * table.
   * 
   * @param options - Options for calling this function.
   */
  export function getDataByField(options: IGetDataByFieldOptions): ReadonlyJSONValue[] {
    return options.data.data.map(row => row[options.field]);
  };

  /**
   * Creates a `SortExecutor` and executes it with the provided options. 
   * 
   * @param options - Options for calling this function.
   */
  export function executeSort(options: IExecuteSortOptions): ReadonlyJSONValue[] {
    const testObject = new SortExecutor({
      field: options.field, dType: options.dType, desc: options.desc
    });
    const result = testObject.apply(options.data);
    return Private.getDataByField({ data: result, field: options.field });
  }

  /**
   * Creates a `FilterExecutor` and executes it with the provided options. 
   * 
   * @param options - Options for calling this function.
   */
  export function executeFilter(options: IExecuteFilterOptions): ReadonlyJSONValue[] {
    const testObject = new FilterExecutor({
      field: options.field,
      dType: options.dType,
      operator: options.operator,
      value: options.value
    });
    const result = testObject.apply(options.data);
    return Private.getDataByField({ data: result, field: options.field });
  }

  /**
   * An options object for returning an array of data from a table.
   */
  export interface IGetDataByFieldOptions {
    /**
     * The table to operate on.
     */
    data: ViewBasedJSONModel.IData

    /**
     * The name of the field to operate on.
     */
    field: string
  }

  /**
   * An options object for executing a sort operation.
   */
  export interface IExecuteSortOptions {

    /**
     * The table to operate on.
     */
    data: ViewBasedJSONModel.IData

    /**
     * The name of the field to operate on.
     */
    field: string

    /**
     * Indicates if the sort should be in descending or ascending order
     */
    desc: boolean

    /**
     * The dtype of the column being operated on.
     */
    dType: string
  }

  /**
   * An options object for executing a filter operation.
   */
  export interface IExecuteFilterOptions {

    /**
     * The table to operate on.
     */
    data: ViewBasedJSONModel.IData

    /**
     * The name of the field to operate on.
     */
    field: string

    /**
     * The operator to use for this transform.
     */
    operator: Transform.FilterOperator

    /**
     * The dtype of the column being operated on.
     */
    dType: string

    /**
     * The value to filter by.
     */
    value: any
  }

  /**
   * An interface that defines the data needed for a filter test case.
   */
  export interface FilterTestCase {

    /**
     * The operator to use for this transform.
     */
    op: Transform.FilterOperator

    /**
     * The value to filter by.
     */
    value: any

    /**
     * The dtype of the column being operated on.
     */
    dType: string

    /**
     * The data used to create the table for testing.
     */
    data: any[]

    /**
     * The expected data to be returned after the test.
     */
    expected: any[]
  }

  /**
   * An interface that defines the data needed for a sort test case.
   */
  export interface SortTestCase {

    /**
     * Indicates if the sort should be in descending or ascending order
     */
    desc: boolean

    /**
     * The dtype of the column being operated on.
     */
    dType: string

    /**
     * The data used to create the table for testing.
     */
    data: any[]

    /**
     * The expected data to be returned after the test.
     */
    expected: any[]
  }
}