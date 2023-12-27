// needed node.js installations npm i sqlite3 & npm i sqlite

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { json } from '@sveltejs/kit';

export async function GET() {
	// open the database
	const db = await open({
		filename: 'C:/sqlite3/calendar.db',
		driver: sqlite3.Database
	});

	// get all rows from the meetings_table
	const data = await db.all('SELECT * FROM meetings_table');

	// close the database connection
	db.close();

	// return the data as JSON
	return json(data);
}
