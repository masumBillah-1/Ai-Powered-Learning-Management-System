// Sample import without .js extension
import type { NextRequest } from 'next/server'
import * as entry from './route'

type TEntry = typeof import('./route')
