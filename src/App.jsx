import './App.css'
import MainPage from './pages/MainPage'
import OnTheRunPage from './pages/OnTheRunPage'
import LateReportPage from './pages/LateReportPage'
import SearchLinePage from './pages/SearchLinePage'
import LineInfoPage from './pages/LineInfoPage'
import GeneralMapPage from './pages/GeneralMapPage'
import { Routes, Route } from 'react-router'
import { Header } from './components/ui/header'

function App() {	
	return (
		<div className='w-full flex flex-col justify-center items-center'>

      <Header />
			<main className='w-full flex flex-col justify-center items-center'>
				<Routes>como remover todos 
					<Route
						path='/'
						element={<MainPage />}
					/>
					<Route
						path='/ontherun'
						element={<OnTheRunPage />}
					/>
					<Route
						path='/latereport'
						element={<LateReportPage />}
					/>
					<Route
						path='/searchline'
						element={<SearchLinePage />}
					/>
					<Route
						path='/lineinfo'
						element={<LineInfoPage />}
					/>
					<Route
						path='/generalmap'
						element={<GeneralMapPage />}
					/>
				</Routes>
			</main>
		</div>
	)
}

export default App
