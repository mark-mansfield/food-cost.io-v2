// we need to access our models
const Menu = require('../models/menu');

exports.createmenu =  (req,res,next) => {
  const url =   req.protocol + '://' + req.get('host');
  const menu = new Menu({
    _id: req.body.id,
    title: req.body.title,
    description: req.body.description,
    imagePath : url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  debugger
  // mongoose  automatically creates the collection based upon the Model name it used during Models.exports for this object use node
  menu.save().then(createdMenu => {
    if (createdMenu) {
      res.status(201).json({
        message: "Menu Added",
        menu: {
          id: createdMenu._id, // remap id mongo adds _id property
          title: createdMenu.title,
          description: createdMenu.description,
          imagePath: createdMenu.imagePath,
          creator: createdMenu.userId
        }
      })
    } else {
      res.status(201).json({  message: "Menu Not Added" })
    }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Creating a menu Failed!'
    })
  });
}

exports.updateMenu = (req,res,next) => {
  let imagePath = req.body.imagePath; // the string already defined in this menu
  if (req.file) {
    const url =   req.protocol + '://' + req.get('host');
    imagePath = url + "/images/" + req.file.filename;
  }
  const menu = new Menu({
    _id: req.body.id,
    title: req.body.title,
    description: req.body.description,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Menu.updateOne({
      _id: req.params.id,
      creator: req.userData.userId
    },
    menu
  ).then(result => {
  if (result.n > 0 ) {
    res.status(200).json({message: 'Menu updated successfully'})
  } else {
    res.status(401).json({message: 'Not Authorized!'})
  }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Couldn\'t Update Menu!'
    });
  });
}

exports.getMenus = (req,res,next) => {
  Menu.find().then(documents => {
    // return json object with status code
    res.status(200).json({
      message: "menus fetched successfully",
      menus: documents
    });
  })
  .catch(error => {
    res.status(500).json({
      message: 'Fetching Menus Failed!'
    });
  });;
}

exports.getMenu =  (req,res,next) => {
  Menu.findById(req.params.id).then (menu => {
    if (menu) {
      res.status(200).json(menu);
    } else {
      res.status(404).json({message: "Menu not found."})
    }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Fetching Menu Failed!'
    });
  });
}

exports.deleteMenu = (req,res, next) => {
  Menu.deleteOne({_id: req.params.id, creator: req.userData.userId}).then( result => {
    console.log(result);
    if (result.n > 0 ) {
      res.status(200).json({message: 'deletion successful'})
    } else {
      res.status(401).json({message: 'Not Authorized!'})
    }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Deleting Menus Failed!'
    });
  });;
}
