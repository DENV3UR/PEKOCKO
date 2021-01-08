const Sauce = require('../models/sauce');
//const bcrypt = require('bcrypt');
var ObjectId = require('mongodb').ObjectId;
const jwt = require('jsonwebtoken');

exports.getall = (req, res, next) => {
    Sauce.find({}, function (err, docs) {
      return res.status(201).json(docs);
  });
        
};

exports.create = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes : 0,
      dislikes : 0,
      usersLikes : [],
      usersDislokes : [],
      userId : userId 
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
};

exports.getOne = (req, res, next) => {
  Sauce.findOne({ "_id" : ObjectId(req.params.id) }, function (err, sauce){
    return res.status(201).json(sauce);
  })
      
};

exports.updateLikes = (req, res, next) => {
  Sauce.findOne({ "_id" : ObjectId(req.params.id) })
  .then(sauce => {
    if (!sauce) {
      return res.status(401).json({ error: 'Sauce non trouvé !' });
    }
    const userId = req.body.userId;
    console.log(req.body.like)
    if(req.body.like == 1) {
      console.log('LIKE');
      if (sauce.usersLiked.includes(userId)) return res.status(401).json({ error: 'User already liked !' });
      else {
        sauce.usersLiked.push(userId);
      };
    }
    else if(req.body.like == -1){
      if (sauce.usersDisliked.includes(userId)) return res.status(401).json({ error: 'User already dislikes!' });
      else sauce.usersDisliked.push(userId);
    }
    else if(req.body.like == 0){
      if (sauce.usersDisliked.includes(userId)) sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId), 1);
      else if (sauce.usersLiked.includes(userId)) sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId), 1);
    }
    sauce.likes = sauce.usersLiked.length;
    sauce.dislikes = sauce.usersDisliked.length;
    Sauce.updateOne({"_id" : ObjectId(sauce._id)},sauce)
    .then(() => res.status(201).json({ message: 'Sauce modifiée!'}))
    .catch(error => res.status(400).json({ error }));

  })
  .catch(error => res.status(500).json({ error }));      
};



exports.update = (req, res, next) => {
  if(req.file != undefined){
    console.log(req.body);
  Sauce.updateOne({ _id: ObjectId(req.params.id) }, { ...JSON.parse(req.body.sauce),imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, _id: ObjectId(req.params.id) })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
  }
  else{
    console.log(req.body);
    Sauce.updateOne({ _id: ObjectId(req.params.id) }, { ...req.body, _id: ObjectId(req.params.id) })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
  }
};

exports.delete = (req, res, next) => {
  Sauce.deleteOne({ _id: ObjectId(req.params.id) })
    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
    .catch(error => res.status(400).json({ error }));
};