import { FilterQuery, Query } from "mongoose";

/**
 * Generic query builder class for MongoDB operations
 * Provides chainable methods for search, pagination, sorting, field selection, and filtering
 */
export class QueryBuilder<T> {
  public query: Record<string, unknown>; // Request query parameters
  public modelQuery: Query<T[], T>; // Mongoose query instance

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.query = query;
    this.modelQuery = modelQuery;
  }

  /**
   * Add text search functionality across specified fields
   * @param searchableFields - Array of field names to search in
   */
  search(searchableFields: string[]) {
    let searchTerm = "";

    if (this.query?.searchTerm) {
      searchTerm = this.query.searchTerm as string;
    }

    this.modelQuery = this.modelQuery.find({
      $or: searchableFields.map(
        (field) =>
          ({
            [field]: new RegExp(searchTerm, "i"),
          }) as FilterQuery<T>
      ),
    });

    return this;
  }

  /**
   * Add pagination with skip and limit
   * Default: page=1, limit=10
   */
  paginate() {
    const limit: number = Number(this.query?.limit || 10);
    let skip: number = 0;

    if (this.query?.page) {
      const page: number = Number(this.query?.page || 1);
      skip = Number((page - 1) * limit);
    }

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  /**
   * Add sorting functionality
   * Default: sort by createdAt (newest first)
   */
  sort() {
    let sortBy = "-createdAt";

    if (this.query?.sortBy) {
      sortBy = this.query.sortBy as string;
    }

    this.modelQuery = this.modelQuery.sort(sortBy);
    return this;
  }

  /**
   * Field selection for response projection
   * Accepts comma-separated field names
   */
  fields() {
    let fields = "";

    if (this.query?.fields) {
      fields = (this.query?.fields as string).split(",").join(" ");
    }

    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  /**
   * Apply filters from query parameters
   * Excludes reserved query fields (searchTerm, page, limit, etc.)
   */
  filter() {
    const queryObj = { ...this.query };
    const excludeFields = ["searchTerm", "page", "limit", "sortBy", "fields"];

    excludeFields.forEach((field) => delete queryObj[field]);

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
    return this;
  }
}
