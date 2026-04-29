export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.hostname === 'bt199.com') {
    url.hostname = 'www.bt199.com';
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
}
