// import { QueryBuilder } from "../../builder/QueryBuilder";
// import { TestsSearcableFields } from "./test.constant";
import { TTest } from "./test.interface";
import { Test } from "./test.model";

const createTestIntoDB = async (payload: TTest) => {
    const result = await Test.create(payload);

    return result;
}

const getAllTestsFromDB = async () => {
    const result = await Test.find();

    return result;
}


// get data by query

// const getAllTestsFromDB = async (query: Record<string, unknown>) => {
//     const testQuery = new QueryBuilder(Test.find(), query).filter().search(TestsSearcableFields).sort().paginate().fields();

//     const result = await testQuery.modelQuery;

//     return result;
// }

export const TestServices = {
    createTestIntoDB,
    getAllTestsFromDB,
}
