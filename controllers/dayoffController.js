const jwt = require("jsonwebtoken");
const getUserFromHeader = require("../utils/token");


exports.requestDayOff = async (req,res) => {
    //const { leaveType , reason , startDate , endDate , days } = req.body;

    const user = await getUserFromHeader(req);
    console.log (user)
}