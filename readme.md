Here's the README formatted in proper markdown:

# FRED MCP Server

A Model Context Protocol (MCP) server implementation for accessing the Federal Reserve Economic Data (FRED) API. This server provides tools to search and retrieve economic data series from FRED.

## Prerequisites

- Node.js (v16 or higher)
- FRED API Key (obtain from [FRED API](https://fred.stlouisfed.org/docs/api/api_key.html))

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kablewy/fred-mcp-server
   cd fred-mcp-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the `.env.example` file to `.env` and add your FRED API key:
   ```
   FRED_API_KEY=your_api_key_here
   ```

## Usage

### Development

Run the server in development mode:
```bash
npm run dev
```

### Production

1. Build the project:
   ```bash
   npm run build
   ```

2. Start the server:
   ```bash
   npm start
   ```

## Available Tools

The server provides the following FRED API tools:

### Series Search
Search for economic data series using various parameters.

### Series Observations
Retrieve observations for a specific economic data series with options for:
- Date range filtering
- Frequency adjustment
- Aggregation methods
- Sorting and pagination

## Development

### Project Structure
```
fred-mcp-server/
├── src/
│   ├── index.ts      # Server entry point
│   ├── tools.ts      # Tool implementations
│   └── types.ts      # TypeScript interfaces
├── package.json
├── tsconfig.json
└── .env
```

### Testing

Run the test suite:
```bash
npm test
```

## License

[Your chosen license]

## Contributing

[Your contribution guidelines]

## Acknowledgments

- Built with [Model Context Protocol SDK](https://github.com/modelcontextprotocol/sdk)
- Data provided by [Federal Reserve Economic Data (FRED)](https://fred.stlouisfed.org/)
