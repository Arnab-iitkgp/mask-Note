import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // Redirect to dashboard if the user is already authenticated
  // and trying to access sign-in, sign-up, or home page
  if (
    token &&
    (url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify') ||
      url.pathname === '/')
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}


// import { NextRequest, NextResponse } from 'next/server';
// import { getToken } from 'next-auth/jwt';
// export { default } from 'next-auth/middleware'; // for entire..

// export async function middleware(request:NextRequest){
//     const token = await getToken({req:request})
//     const url = request.nextUrl

//     if(token && url.pathname.startsWith('/sign-in') ||  url.pathname.startsWith('/sign-up') ||  url.pathname.startsWith('/verify') ||  url.pathname.startsWith('/')){
//         return NextResponse.redirect(new URL('/', request.url))
//     }
//     return NextResponse.redirect(new URL('/', request.url))
// }

// // where the middle ware will take  into account

// export const config ={
//     matcher: [
//         '/sign-in',
//         '/sign-up',
//         '/dashboard',
//         '/'
//     ]
// }