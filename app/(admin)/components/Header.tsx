import Link from 'next/link';


function Header() {
  return (
    <header>
        <Link href='/'>
        {/* avatar */}
          <div>
            <h1>Assistly</h1>
            <h2 className="text-sm">Your Customizable AI Chat Agent</h2>
          </div>
        </Link>
    </header>
  )
}
export default Header