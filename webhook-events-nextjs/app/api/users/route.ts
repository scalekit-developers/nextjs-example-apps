import { NextRequest, NextResponse } from 'next/server';
import userMockDB from '../webhook/user-access/user_DB'; 

/**
 * API Endpoint: /api/users
 * - GET: Fetch all users
 */

export async function GET(req: NextRequest) {
    try {
        const users = await userMockDB.getAllUsers();
        return NextResponse.json({ message: 'Users retrieved successfully', users }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching users:', error.message);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}