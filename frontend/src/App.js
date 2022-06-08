import { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = 'supanthapaul';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_GIFS = [
	'https://media3.giphy.com/media/KBfKueAjIJV8Q/200w.webp?cid=ecf05e47nbsbnzf6uwjxrx3njwjj8n6321jhhodiadwqxcg7&rid=200w.webp&ct=g',
	'https://media3.giphy.com/media/l0MYt5jPR6QX5pnqM/200w.webp?cid=ecf05e47nbsbnzf6uwjxrx3njwjj8n6321jhhodiadwqxcg7&rid=200w.webp&ct=g',
	'https://media0.giphy.com/media/WsNbxuFkLi3IuGI9NU/200.webp?cid=ecf05e47wj6zedclktdfi8hte6k7prsl3yie4biz1t5dojfl&rid=200.webp&ct=g',
	'https://media0.giphy.com/media/9oF7EAvaFUOEU/giphy.webp?cid=ecf05e47wj6zedclktdfi8hte6k7prsl3yie4biz1t5dojfl&rid=giphy.webp&ct=g'
]

const App = () => {
	const [walletAddress, setWalletAddress] = useState(null);
	const [inputValue, setInputValue] = useState('');
	const [gifList, setGifList] = useState([]);

	useEffect(() => {
		const onLoad = async () => {
			await checkIfWalletIsConnected();
		};
		window.addEventListener('load', onLoad);
		return () => window.removeEventListener('load', onLoad);
	}, []);

	useEffect(() => {
		if (walletAddress) {
			console.log('Fetching GIF list...');
			
			// Call Solana program here.
	
			// Set state
			setGifList(TEST_GIFS);
		}
	}, [walletAddress]);

	const checkIfWalletIsConnected = async () => {
		try {
			const { solana } = window;

			if (solana) {
				if (solana.isPhantom) {
					console.log('Phantom wallet found!');

					// connect to phantom wallet
					// https://docs.phantom.app/integrating/establishing-a-connection#eagerly-connecting
					const response = await solana.connect({ onlyIfTrusted: true });
					console.log(
						'Connected with Public Key:',
						response.publicKey.toString()
					);
					setWalletAddress(response.publicKey.toString());
				}
			} else {
				alert('Solana object not found! Get a Phantom Wallet 👻');
			}
		} catch (error) {
			console.error(error);
		}
	};

	const connectWallet = async () => {
		const { solana } = window;

		if (solana) {
			const response = await solana.connect();
			console.log('Connected with Public Key:', response.publicKey.toString());
			setWalletAddress(response.publicKey.toString());
		}
	};

	const onInputChange = (event) => {
		const { value } = event.target;
		setInputValue(value);
	};

	const sendGif = async () => {
		if (inputValue.length > 0) {
			console.log('Gif link:', inputValue);
			setGifList([...gifList, inputValue]);
			setInputValue('');
		} else {
			console.log('Empty input. Try again.');
		}
	};

	const renderConnectedContainer = () => (
		<div className="connected-container">
			{/* Go ahead and add this input and button to start */}
			<form
				onSubmit={(event) => {
					event.preventDefault();
					sendGif();
				}}
			>
				<input
					type="text"
					placeholder="Enter gif link!"
					value={inputValue}
					onChange={onInputChange}
				/>
				<button type="submit" className="cta-button submit-gif-button">Submit</button>
			</form>
			<div className="gif-grid">
				{gifList.map((gif) => (
					<div className="gif-item" key={gif}>
						<img src={gif} alt={gif} />
					</div>
				))}
			</div>
		</div>
	);

	const renderNotConnectedContainer = () => (
		<button
			className="cta-button connect-wallet-button"
			onClick={connectWallet}
		>
			Connect to Wallet
		</button>
	);

	

	return (
		<div className="App">
			<div className={walletAddress ? 'authed-container' : 'container'}>
				<div className="header-container">
					<p className="header">🏢 GIF Portal</p>
					<p className="sub-text">
						View your GIF collection in the metaverse ✨
					</p>
					{!walletAddress ? renderNotConnectedContainer() : renderConnectedContainer()}
				</div>
				<div className="footer-container">
					<img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
					<a
						className="footer-text"
						href={TWITTER_LINK}
						target="_blank"
						rel="noreferrer"
					>{`built by @${TWITTER_HANDLE}`}</a>
				</div>
			</div>
		</div>
	);
};

export default App;
