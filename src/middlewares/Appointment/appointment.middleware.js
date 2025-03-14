// require
const DareModel = require('../../models/Dare/dare.model');
const InstantModel = require('../../models/Instant/instant.model');
const UserModel = require('../../models/User/user.model');


// middleware
async function getAppointmentVerify(req, res, next){
    const user_idx = req.jwt_user_idx;

    if(!user_idx) return res.status(401).json("Available after login");
    
    next();
}

async function getAppointment(req, res, next){
    const user_idx = req.jwt_user_idx;

    let users = {};
    
    const appointment = [
        await InstantModel.Func.getInstantByUser(user_idx),
        await InstantModel.Func.getPendingInstantByUser(user_idx),
        await DareModel.Func.getDareByUser(user_idx),
        await DareModel.Func.getPendingDareByUser(user_idx),
    ]

    for(let t = 0; t < 4; t++){
        for(let i = 0; i < appointment[t].length; i++){
            for(let j = 0; j < appointment[t][i].invited.length; j++){
                const idx = appointment[t][i].invited[j];
                if(!users[idx]){
                    const user = await UserModel.Schema.findById(idx);
                    users[idx] = {
                        idx: user._id,
                        id: user.id,
                        nickname: user.nickname,
                        profileImageUrl: user.profileImageUrl
                    };
                }
                appointment[t][i].invited[j] = users[idx];
            }
            for(let j = 0; j < appointment[t][i].pending.length; j++){
                const idx = appointment[t][i].pending[j];
                if(!users[idx]){
                    const user = await UserModel.Schema.findById(idx);
                    users[idx] = {
                        idx: user._id,
                        id: user.id,
                        nickname: user.nickname,
                        profileImageUrl: user.profileImageUrl
                    };
                }
                appointment[t][i].pending[j] = users[idx];
            }
        }
    }

    return res.status(200).json({result: 1, data: {
        invitedInstant: appointment[0],
        pendingInstant: appointment[1],
        invitedDare: appointment[2],
        pendingDare: appointment[3]
    }});
}



const Appointment = {
    getAppointment: [getAppointmentVerify, getAppointment],
}

module.exports = Appointment;