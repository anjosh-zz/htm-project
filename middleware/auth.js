export default function ({ store, error }) {
  if (!store.state.loggedIn) {
    error({
      message: 'You are not logged in.',
      statusCode: 403
    })
  }
}
