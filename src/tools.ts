type ToolHandler<T> = (args: T) => Promise<unknown>;

export interface Tool<T = any> {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  };
  handler: ToolHandler<T>;
}

interface SearchSeriesArgs {
  searchText: string;
  limit?: number;
  orderBy?: 'searchrank' | 'series_id' | 'title' | 'units' | 'frequency' | 'seasonal_adjustment' | 'realtime_start' | 'realtime_end' | 'last_updated' | 'observation_start' | 'observation_end' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  filterVariable?: string;
  filterValue?: string;
  tagNames?: string[];
  excludeTagNames?: string[];
}

interface GetSeriesArgs {
  seriesId: string;
  startDate?: string;
  endDate?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
  frequency?: 'd' | 'w' | 'bw' | 'm' | 'q' | 'sa' | 'a';
  aggregationMethod?: 'avg' | 'sum' | 'eop';
  outputType?: 1 | 2 | 3 | 4;
  vintage_dates?: string[];
}

const BASE_URL = 'https://api.stlouisfed.org/fred';

export const tools: Tool[] = [
  {
    name: 'search',
    description: 'Search for FRED data series with advanced filtering options',
    inputSchema: {
      type: 'object',
      properties: {
        searchText: { type: 'string', description: 'Search text for FRED series' },
        limit: { type: 'number', description: 'Maximum number of results to return (default: 1000)' },
        orderBy: { 
          type: 'string', 
          enum: ['searchrank', 'series_id', 'title', 'units', 'frequency', 'seasonal_adjustment', 
                'realtime_start', 'realtime_end', 'last_updated', 'observation_start', 
                'observation_end', 'popularity'],
          description: 'Order results by this property'
        },
        sortOrder: { 
          type: 'string', 
          enum: ['asc', 'desc'], 
          description: 'Sort order (default: asc)'
        },
        filterVariable: { type: 'string', description: 'Variable to filter results by' },
        filterValue: { type: 'string', description: 'Value of filter variable' },
        tagNames: { 
          type: 'array', 
          items: { type: 'string' }, 
          description: 'Series tags to include'
        },
        excludeTagNames: { 
          type: 'array', 
          items: { type: 'string' }, 
          description: 'Series tags to exclude'
        }
      },
      required: ['searchText']
    },
    handler: async (args: SearchSeriesArgs) => {
      const url = new URL(`${BASE_URL}/series/search`);
      url.searchParams.append('api_key', process.env.FRED_API_KEY!);
      url.searchParams.append('search_text', args.searchText);
      url.searchParams.append('file_type', 'json');

      if (args.limit) url.searchParams.append('limit', args.limit.toString());
      if (args.orderBy) url.searchParams.append('order_by', args.orderBy);
      if (args.sortOrder) url.searchParams.append('sort_order', args.sortOrder);
      if (args.filterVariable) url.searchParams.append('filter_variable', args.filterVariable);
      if (args.filterValue) url.searchParams.append('filter_value', args.filterValue);
      if (args.tagNames) url.searchParams.append('tag_names', args.tagNames.join(';'));
      if (args.excludeTagNames) url.searchParams.append('exclude_tag_names', args.excludeTagNames.join(';'));

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`FRED API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.seriess;
    }
  },
  {
    name: 'series',
    description: 'Get observations for a specific FRED data series with advanced options',
    inputSchema: {
      type: 'object',
      properties: {
        seriesId: { type: 'string', description: 'FRED series ID' },
        startDate: { type: 'string', description: 'Start date in YYYY-MM-DD format' },
        endDate: { type: 'string', description: 'End date in YYYY-MM-DD format' },
        sortOrder: { 
          type: 'string', 
          enum: ['asc', 'desc'], 
          description: 'Sort order (default: asc)'
        },
        limit: { type: 'number', description: 'Maximum number of results to return' },
        offset: { type: 'number', description: 'Number of results to skip' },
        frequency: { 
          type: 'string', 
          enum: ['d', 'w', 'bw', 'm', 'q', 'sa', 'a'],
          description: 'Frequency of observations (d=daily, w=weekly, bw=biweekly, m=monthly, q=quarterly, sa=semiannual, a=annual)'
        },
        aggregationMethod: { 
          type: 'string', 
          enum: ['avg', 'sum', 'eop'],
          description: 'Aggregation method for frequency conversion (avg=average, sum=sum, eop=end of period)'
        },
        outputType: {
          type: 'number',
          enum: [1, 2, 3, 4],
          description: '1=observations by real-time period, 2=observations by vintage date, 3=vintage dates, 4=initial release plus current value'
        },
        vintageDates: {
          type: 'array',
          items: { type: 'string' },
          description: 'Vintage dates in YYYY-MM-DD format'
        }
      },
      required: ['seriesId']
    },
    handler: async (args: GetSeriesArgs) => {
      const url = new URL(`${BASE_URL}/series/observations`);
      url.searchParams.append('api_key', process.env.FRED_API_KEY!);
      url.searchParams.append('series_id', args.seriesId);
      url.searchParams.append('file_type', 'json');
      
      if (args.startDate) url.searchParams.append('observation_start', args.startDate);
      if (args.endDate) url.searchParams.append('observation_end', args.endDate);
      if (args.sortOrder) url.searchParams.append('sort_order', args.sortOrder);
      if (args.limit) url.searchParams.append('limit', args.limit.toString());
      if (args.offset) url.searchParams.append('offset', args.offset.toString());
      if (args.frequency) url.searchParams.append('frequency', args.frequency);
      if (args.aggregationMethod) url.searchParams.append('aggregation_method', args.aggregationMethod);
      if (args.outputType) url.searchParams.append('output_type', args.outputType.toString());
      if (args.vintage_dates) url.searchParams.append('vintage_dates', args.vintage_dates.join(','));

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`FRED API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.observations;
    }
  }
];