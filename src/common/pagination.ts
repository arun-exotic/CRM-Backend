export interface PaginationQuery {
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }
  
  export function buildPagination(query: any) {
    const page = query.page ? Number(query.page) : 1;     
    const limit = query.limit ? Number(query.limit) : 10; 
    const sortBy = query.sortBy || 'id';
    const order: 'asc' | 'desc' =
      query.order === 'desc' ? 'desc' : 'asc';
  
    return { page, limit, sortBy, order };
  }
  
  