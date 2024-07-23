import { login, signup } from './actions'

export default function LoginPage() {
  return (
  <>    
    <form className='flex flex-col space-y-10'>
      <label htmlFor="email">Email:</label>
      <input className='rounded-md p-2' id="email" name="email" type="email" placeholder='email' required />
      <label htmlFor="password">Password:</label>
      <input className='rounded-md p-2' id="password" name="password" type="password" required placeholder='password'/>
      <div className=' flex flex-col justify-center space-y-5  '>      
        <button className='bg-gradient-to-r from-black to-blue-300 rounded-md p-2' formAction={login}>Log in</button>
        <button className='bg-gradient-to-r from-black to-blue-300 rounded-md p-2' formAction={signup}>Sign up</button>
      </div>
    </form>
  </>
  )
}