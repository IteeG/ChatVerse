const OneToOneMessageSchema = require('./models/OneToOneMessageSchema');
const GroupMessageSchema = require('./models/GroupMessageSchema');

const saveOneToOneMessage= (sender, recipient, content)=>{
  const message = new OneToOneMessageSchema({ sender, recipient, content });
  console.log(message);
  return message.save();
}

const saveGroupMessage= (sender, groupId, content)=> {
  const message = new GroupMessageSchema({ sender, groupId, content });
  console.log(message);
  return message.save();
}


//retrieve individual message from mongoDb
const getOneToOneMessages = async(sender, recipient) => {
  return OneToOneMessageSchema.find({ $or: [{ sender, recipient }, { sender: recipient, recipient: sender }] })
      .sort({ timestamp: 1 })
      .exec()
      .then(messages => {
          return messages;
      })
      .catch(err => {
          throw err; // or handle the error as needed
      });
};

const getGroupMessages = async(groupId) => {
  return GroupMessageSchema.find({ groupId })
      .sort({ timestamp: 1 })
      .exec()
      .then(messages => {
          return messages;
      })
      .catch(err => {
          throw err; // or handle the error as needed
      });
}

module.exports = { saveOneToOneMessage, saveGroupMessage, getOneToOneMessages, getGroupMessages };