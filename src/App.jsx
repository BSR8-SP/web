import './App.css'
import { Button } from './components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card';

function App() {	
	return (
		<div className='w-full flex flex-col justify-center items-center'>
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle>Login to your account</CardTitle>
					<CardDescription>
					Enter your email below to login to your account
					</CardDescription>
					<CardAction>
					<Button variant="link">Sign Up</Button>
					</CardAction>
				</CardHeader>
				<CardContent>
					Conteúdo do card
				</CardContent>
				<CardFooter className="flex-col gap-2">
					<Button type="submit" className="w-full">
					Login
					</Button>
					<Button variant="outline" className="w-full">
					Login with Google
					</Button>
				</CardFooter>
			</Card>
			<Button>
				Isto é um botão
			</Button>
		</div>
	)
}

export default App
