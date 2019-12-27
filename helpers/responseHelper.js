module.exports = {
  withSuccess: (data) => {
    return {
      status: true,
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