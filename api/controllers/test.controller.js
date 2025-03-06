export const get = (req, res) => {
    res.json({message: "Api get test success"})
}

export const testsignedin = (req, res) => {
    res.status(200).json({message: "Signed in."})
}