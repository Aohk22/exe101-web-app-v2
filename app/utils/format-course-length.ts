export function formatCourseLength(seconds: number) {
	const hours = seconds / 3600
	return `${hours % 1 === 0 ? hours.toFixed(0) : hours.toFixed(1)}h`
}
