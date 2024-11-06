import Header from "../components/common/Header";
import ConnectedAccounts from "../components/settings/ConnectedAccounts";
import Notifications from "../components/settings/Notifications";
import Security from "../components/settings/Security";
import { Settings } from "lucide-react";
import { Helmet } from "react-helmet";
import ReactDOMServer from "react-dom/server";
const svgIcon = encodeURIComponent(
	ReactDOMServer.renderToStaticMarkup(<Settings stroke="#10B981" />)
  );
const svgFavicon = `data:image/svg+xml,${svgIcon}`;
const SettingsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Helmet>
				<link rel="icon" type="image/svg+xml" href={svgFavicon} />
				<title>Setting</title>
			</Helmet>
			<Header title='Settings' />
			<main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
				<Notifications />
				<Security />
				<ConnectedAccounts />
			</main>
		</div>
	);
};
export default SettingsPage;
