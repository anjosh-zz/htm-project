export default function ({ store, redirect }) {
  if (!store.state.loggedIn) {
    redirect('/login')
    // error({
    //   message: 'You are not logged in.',
    //   statusCode: 403
    // })
  }
}
