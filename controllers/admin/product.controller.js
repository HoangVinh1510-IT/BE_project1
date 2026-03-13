const Product = require("../../models/product.model");

const systemConfig = require("../../config/system");

const methodOverride = require("method-override");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

//[GET] /admin/products

module.exports.index = async (req, res) => {
  //console.log(req.query.status);

  //đoanj code lọc status
  const filterStatus = filterStatusHelper(req.query);

  let find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }
  //srearch
  const objectSearch = searchHelper(req.query);

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }
  //end search

  //pagination
  const countProducts = await Product.countDocuments(find);

  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    countProducts
  );

  //end pagination
  const products = await Product.find(find)
    .sort({ position:"desc"})
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

    
  res.render("admin/pages/products/index", {
  pageTitle: "Danh sách sản phẩm",
  products: products,
  filterStatus: filterStatus,
  keyword: objectSearch.keyword,
  pagination: objectPagination,
  messages: {
    success: req.flash("success"),
    error: req.flash("error")
  }
});
};

//[PATCH] /admin/products/change-status/:status/:id

module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  const back = req.query.back;

  await Product.updateOne({ _id: id }, { status: status });

  req.flash("success", "Cập nhật trạng thái thành công!");

  res.redirect(back || "/admin/products");
};

//[PATCH] /admin/products/change-multi

module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(",");
  const back = req.body.back;

  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
    req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
      
      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`);
      break;
    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedAt: new Date(),
        }
      );
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne({ _id: id }, { position: position });
      }
      // await Product.updateMany({_id: {$in: ids}},{
      //     deleted : true,
      //     deletedAt: new Date()
      // });
      break;
    default:
      break;
  }
  res.redirect(back || "/admin/products");
};

//[DELETE] /admin/products/delete/:id
//XÓA VĨNH VIỄN
//     module.exports.deleteItem = async (req, res) => {
//     const id  = req.params.id;
//     const back = req.query.back;

//     await Product.deleteOne({_id: id});
//     res.redirect(back || "/admin/products");
// };

//[DELETE] /admin/products/delete/:id XÓA MỀM
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  const back = req.query.back;

  await Product.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedAt: new Date(),
    }
  );
  res.redirect(back || "/admin/products");
};


//[GET] /admin/products/create

module.exports.create = async (req, res) => {
  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm",
    messages: {
      success: req.flash("success"),
      error: req.flash("error")
    }
  });
};
//[POST] /admin/products/create
module.exports.createPost = async (req, res) => {

  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discount);
  req.body.stock = parseInt(req.body.stock);

  delete req.body.discount;

  if(req.body.position == ""){
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  }else{
    req.body.position = parseInt(req.body.position);
  }

  if(req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }

  const product = new Product(req.body);
  await product.save();

  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

//[GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find ={
      deleted: false,
      _id: req.params.id
    }
    const product = await Product.findOne(find);

    res.render("admin/pages/products/edit", {
    pageTitle: "Chỉnh sửa sản phẩm",
    product: product,
    messages: {
    success: req.flash("success"),
    error: req.flash("error")
  }
});
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }

};
//[PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discount);
  req.body.stock = parseInt(req.body.stock);

  if(req.file){
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }
try {
  await Product.updateOne({_id: id,}, req.body);
  req.flash("success", "Cập nhật sản phẩm thành công!");

} catch (error) {
  req.flash("error", "Có lỗi xảy ra khi cập nhật sản phẩm!");
}
  res.redirect("back");
};

/*[GET] /admin/products/detail/:id*/
module.exports.detail = async (req, res) => {
  try {
    const find ={
      deleted: false,
      _id: req.params.id
    }
    const product = await Product.findOne(find);

    console.log(product);
    res.render("admin/pages/products/detail", {
    pageTitle: product.title,
    product: product,
    messages: {
    success: req.flash("success"),
    error: req.flash("error")
  }
});
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }

};