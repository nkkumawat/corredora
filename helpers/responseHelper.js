module.exports = {
  withSuccess: (data) => {
    return {
      status: false,
      data: data
    }
  },
  withFailure: (data) => {
    return {
      success: false,
			data: data
    }
  }
}