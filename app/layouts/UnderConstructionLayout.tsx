import { Outlet } from 'react-router'
import UnderConstruction from '~/components/UnderConstruction'

export default function UnderConstructionLayout() {
	return (
		<UnderConstruction
			title="Coming soon"
			description="We're still building the full achievements experience for badges, streaks, and milestone history. You can keep learning as usual while we finish this section."
			backHref="/"
			backLabel="Return to dashboard"
			label="Under construction"
		>
			<Outlet />
		</UnderConstruction>
	)
}
