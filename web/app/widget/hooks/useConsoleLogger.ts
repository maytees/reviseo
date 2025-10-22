/** biome-ignore-all lint/suspicious/noExplicitAny: idk */
import { useEffect, useRef } from "react";

export type LogType =
	| "log"
	| "error"
	| "warn"
	| "info"
	| "debug"
	| "trace"
	| "table"
	| "dir"
	| "dirxml"
	| "group"
	| "groupCollapsed"
	| "groupEnd"
	| "count"
	| "countReset"
	| "time"
	| "timeLog"
	| "timeEnd"
	| "assert"
	| "clear";

export interface LogEntry {
	type: LogType;
	message: unknown[];
	timestamp: string;
}

export function useConsoleLogger() {
	const logsRef = useRef<LogEntry[]>([]);

	useEffect(() => {
		// Store original console methods
		const originalLog = console.log;
		const originalError = console.error;
		const originalWarn = console.warn;
		const originalInfo = console.info;
		const originalDebug = console.debug;
		const originalTrace = console.trace;
		const originalTable = console.table;
		const originalDir = console.dir;
		const originalDirxml = console.dirxml;
		const originalGroup = console.group;
		const originalGroupCollapsed = console.groupCollapsed;
		const originalGroupEnd = console.groupEnd;
		const originalCount = console.count;
		const originalCountReset = console.countReset;
		const originalTime = console.time;
		const originalTimeLog = console.timeLog;
		const originalTimeEnd = console.timeEnd;
		const originalAssert = console.assert;
		const originalClear = console.clear;

		// Override console.log
		console.log = (...args: unknown[]) => {
			logsRef.current.push({
				type: "log",
				message: args,
				timestamp: new Date().toISOString(),
			});
			originalLog.apply(console, args);
		};

		// Override console.error
		console.error = (...args: unknown[]) => {
			logsRef.current.push({
				type: "error",
				message: args,
				timestamp: new Date().toISOString(),
			});
			originalError.apply(console, args);
		};

		// Override console.warn
		console.warn = (...args: unknown[]) => {
			logsRef.current.push({
				type: "warn",
				message: args,
				timestamp: new Date().toISOString(),
			});
			originalWarn.apply(console, args);
		};

		// Override console.info
		console.info = (...args: unknown[]) => {
			logsRef.current.push({
				type: "info",
				message: args,
				timestamp: new Date().toISOString(),
			});
			originalInfo.apply(console, args);
		};

		// Override console.debug
		console.debug = (...args: unknown[]) => {
			logsRef.current.push({
				type: "debug",
				message: args,
				timestamp: new Date().toISOString(),
			});
			originalDebug.apply(console, args);
		};

		// Override console.trace
		console.trace = (...args: unknown[]) => {
			logsRef.current.push({
				type: "trace",
				message: args,
				timestamp: new Date().toISOString(),
			});
			originalTrace.apply(console, args);
		};

		// Override console.table
		console.table = (...args: unknown[]) => {
			logsRef.current.push({
				type: "table",
				message: args,
				timestamp: new Date().toISOString(),
			});
			originalTable.apply(console, args as any);
		};

		// Override console.dir
		console.dir = (...args: unknown[]) => {
			logsRef.current.push({
				type: "dir",
				message: args,
				timestamp: new Date().toISOString(),
			});
			originalDir.apply(console, args as any);
		};

		// Override console.dirxml
		console.dirxml = (...args: unknown[]) => {
			logsRef.current.push({
				type: "dirxml",
				message: args,
				timestamp: new Date().toISOString(),
			});
			originalDirxml.apply(console, args);
		};

		// Override console.group
		console.group = (...args: unknown[]) => {
			logsRef.current.push({
				type: "group",
				message: args,
				timestamp: new Date().toISOString(),
			});
			originalGroup.apply(console, args);
		};

		// Override console.groupCollapsed
		console.groupCollapsed = (...args: unknown[]) => {
			logsRef.current.push({
				type: "groupCollapsed",
				message: args,
				timestamp: new Date().toISOString(),
			});
			originalGroupCollapsed.apply(console, args);
		};

		// Override console.groupEnd
		console.groupEnd = (...args: unknown[]) => {
			logsRef.current.push({
				type: "groupEnd",
				message: args,
				timestamp: new Date().toISOString(),
			});
			originalGroupEnd.apply(console, args as any);
		};

		// Override console.count
		console.count = (...args: unknown[]) => {
			logsRef.current.push({
				type: "count",
				message: args,
				timestamp: new Date().toISOString(),
			});
			originalCount.apply(console, args as any);
		};

		// Override console.countReset
		console.countReset = (...args: unknown[]) => {
			logsRef.current.push({
				type: "countReset",
				message: args,
				timestamp: new Date().toISOString(),
			});
			originalCountReset.apply(console, args as any);
		};

		// Override console.time
		console.time = (...args: unknown[]) => {
			logsRef.current.push({
				type: "time",
				message: args,
				timestamp: new Date().toISOString(),
			});
			originalTime.apply(console, args as any);
		};

		// Override console.timeLog
		console.timeLog = (...args: unknown[]) => {
			logsRef.current.push({
				type: "timeLog",
				message: args,
				timestamp: new Date().toISOString(),
			});
			originalTimeLog.apply(console, args as any);
		};

		// Override console.timeEnd
		console.timeEnd = (...args: unknown[]) => {
			logsRef.current.push({
				type: "timeEnd",
				message: args,
				timestamp: new Date().toISOString(),
			});
			originalTimeEnd.apply(console, args as any);
		};

		// Override console.assert
		console.assert = (...args: unknown[]) => {
			logsRef.current.push({
				type: "assert",
				message: args,
				timestamp: new Date().toISOString(),
			});
			originalAssert.apply(console, args as any);
		};

		// Override console.clear
		console.clear = (...args: unknown[]) => {
			logsRef.current.push({
				type: "clear",
				message: args,
				timestamp: new Date().toISOString(),
			});
			originalClear.apply(console, args as any);
		};

		// Cleanup: restore original methods
		return () => {
			console.log = originalLog;
			console.error = originalError;
			console.warn = originalWarn;
			console.info = originalInfo;
			console.debug = originalDebug;
			console.trace = originalTrace;
			console.table = originalTable;
			console.dir = originalDir;
			console.dirxml = originalDirxml;
			console.group = originalGroup;
			console.groupCollapsed = originalGroupCollapsed;
			console.groupEnd = originalGroupEnd;
			console.count = originalCount;
			console.countReset = originalCountReset;
			console.time = originalTime;
			console.timeLog = originalTimeLog;
			console.timeEnd = originalTimeEnd;
			console.assert = originalAssert;
			console.clear = originalClear;
		};
	}, []);

	// Function to get all logs
	const getLogs = (): LogEntry[] => logsRef.current;

	// Function to clear logs
	const clearLogs = (): void => {
		logsRef.current = [];
	};

	return { getLogs, clearLogs };
}

// Example usage in a component:
//
// function App() {
//   const { getLogs, clearLogs } = useConsoleLogger();
//
//   const handleShowLogs = () => {
//     const allLogs = getLogs();
//     console.log('Captured logs:', allLogs);
//   };
//
//   return (
//     <div>
//       <button onClick={handleShowLogs}>Show Logs</button>
//       <button onClick={clearLogs}>Clear Logs</button>
//     </div>
//   );
// }
