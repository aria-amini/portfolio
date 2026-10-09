import { describe, expect, test } from 'vitest'

import { profile, scheduleEmailHref } from '@/lib/profile'

describe('scheduleEmailHref', () => {
	const url = new URL(scheduleEmailHref())

	test('addresses the profile email', () => {
		expect(url.protocol).toBe('mailto:')
		expect(decodeURIComponent(url.pathname)).toBe(profile.email)
	})

	test('names the call length in the subject', () => {
		expect(url.searchParams.get('subject')).toBe(
			`${profile.callMinutes}-minute intro call`,
		)
	})

	test('asks for times and a role in the body', () => {
		const body = url.searchParams.get('body') ?? ''

		expect(body).toContain(`${profile.callMinutes}-minute call`)
		expect(body).toContain('Role and company:')
	})
})
