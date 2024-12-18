const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

var ses = require("nodemailer-ses-transport");
const hbs = require("nodemailer-express-handlebars");
const crypto = require("crypto");

const awsKeys = {
  key: process.env.AWS_KEY,
  secret: process.env.AWS_SECRET,
};
let nodemailer = require("nodemailer");
const Exhibitor = require("../models/Exhibitor");
const Visitor = require("../models/Visitor");
const { sendPhoneMessage } = require("../utils/otpService");
var transporter = nodemailer.createTransport(
  ses({
    accessKeyId: awsKeys.key,
    secretAccessKey: awsKeys.secret,
    region: "us-east-1",
  })
);
// point to the template folder
const handlebarOptions = {
  viewEngine: {
    extname: ".hbs",
    layoutsDir: "views/",
    defaultLayout: "email",
  },
  viewPath: "views/",
  extName: ".hbs",
};
// use a template file with nodemailer
transporter.use("compile", hbs(handlebarOptions));
const emailController = {};
emailController.sendRegisteredMail = async function (visitorId, baseUrl) {
  try {
    // Generate a verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Update the existing visitor record with the verification token and expiry time
    const visitor = await Visitor.findByIdAndUpdate(
      visitorId,
      {
        verificationToken: verificationToken,
        verificationTokenExpires: Date.now() + 2592000000, // 30 days expiration
      },
      { new: true }
    );

    if (!visitor) {
      throw new Error("Visitor not found");
    }

    // Read and compile the email template
    const templatePath = path.join(__dirname, '../templates', 'REGISTRATION_CONFIRMATION_MAIL.html');
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    const template = handlebars.compile(templateSource);

    // Generate verification URL and populate the template
    const verificationUrl = `${baseUrl}/visitor-verify?token=${verificationToken}`;
    const htmlToSend = template({ verificationUrl, name: visitor.name });

    // Send the email
    let info = await transporter.sendMail({
      from: "enquiry@neofairs.com",
      cc: "enquiry@neofairs.com",
      to: visitor.email,
      subject: "Verify Your Email Address",
      html: htmlToSend,
    });
    return info.messageId;

  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};
emailController.sendExhibitorRegisteredMail = async function (exhibitorId) {
  try {
    const exhibitor = await Exhibitor.findById(exhibitorId);

    if (!exhibitor) {
      throw new Error("exhibitor not found");
    }

    // Read and compile the email template
    const templatePath = path.join(__dirname, '../templates', 'REGISTRATION_CONFIRMATION_EXHIBITOR_MAIL.html');
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    const template = handlebars.compile(templateSource);

    const htmlToSend = template({ name: exhibitor.name });

    // Send the verification email
    let info = await transporter.sendMail({
      from: "enquiry@neofairs.com",
      cc: "enquiry@neofairs.com",
      to: exhibitor.email,
      subject: "Registration Confirmation",
      html: htmlToSend
    });
    return info.messageId;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};
emailController.sendApprovalExhibitorMail = async function (data) {
  // Read and compile the email template
  const templatePath = path.join(__dirname, '../templates', 'REGISTRATION_APPROVAL_MAIL.html');
  const templateSource = fs.readFileSync(templatePath, 'utf-8');
  const template = handlebars.compile(templateSource);

  const htmlToSend = template({ name: data.name });

  let info = await transporter.sendMail({
    from: "enquiry@neofairs.com",
    cc: "enquiry@neofairs.com",
    to: data["email"],
    subject: "Approval Email",
    html: htmlToSend
  });
  return info.messageId;
};
// emailController.sendApprovalExhibitorMail = async function (data, password) {
//     let info = await transporter.sendMail({
//         from: "enquiry@neofairs.com",
//         cc: "enquiry@neofairs.com",
//         to: data["email"],
//         subject: "Approval Email",
//         html: `<!DOCTYPE html>
// <html>

// <head>
//     <title>Approval Email</title>
//     <link rel="shortcut icon" href="favicon.ico">
//     <style type="text/css">
//         table[name="blk_permission"], table[name="blk_footer"] {display:none;} 
//     </style>
//     <style type="text/css">
//         /***  Start ***/    
//         [name=bmeMainBody]{min-height:1000px;}    
//         @media only screen and (max-width: 480px){table.blk, table.tblText, .bmeHolder, .bmeHolder1, table.bmeMainColumn{width:100% !important;} }        
//         @media only screen and (max-width: 480px){.bmeImageCard table.bmeCaptionTable td.tblCell{padding:0px 20px 20px 20px !important;} }        
//         @media only screen and (max-width: 480px){.bmeImageCard table.bmeCaptionTable.bmeCaptionTableMobileTop td.tblCell{padding:20px 20px 0 20px !important;} }        
//         @media only screen and (max-width: 480px){table.bmeCaptionTable td.tblCell{padding:10px !important;} }        
//         @media only screen and (max-width: 480px){table.tblGtr{ padding-bottom:20px !important;} }        
//         @media only screen and (max-width: 480px){td.blk_container, .blk_parent, .bmeLeftColumn, .bmeRightColumn, .bmeColumn1, .bmeColumn2, .bmeColumn3, .bmeBody{display:table !important;max-width:600px !important;width:100% !important;} }        
//         @media only screen and (max-width: 480px){table.container-table, .bmeheadertext, .container-table { width: 95% !important; } }        
//         @media only screen and (max-width: 480px){.mobile-footer, .mobile-footer a{ font-size: 13px !important; line-height: 18px !important; } .mobile-footer{ text-align: center !important; } table.share-tbl { padding-bottom: 15px; width: 100% !important; } table.share-tbl td { display: block !important; text-align: center !important; width: 100% !important; } }        
//         @media only screen and (max-width: 480px){td.bmeShareTD, td.bmeSocialTD{width: 100% !important; } }        
//         @media only screen and (max-width: 480px){td.tdBoxedTextBorder{width: auto !important;}}    
//         @media only screen and (max-width: 480px){table.blk, table[name=tblText], .bmeHolder, .bmeHolder1, table[name=bmeMainColumn]{width:100% !important;} }    
//         @media only screen and (max-width: 480px){.bmeImageCard table.bmeCaptionTable td[name=tblCell]{padding:0px 20px 20px 20px !important;} }    
//         @media only screen and (max-width: 480px){.bmeImageCard table.bmeCaptionTable.bmeCaptionTableMobileTop td[name=tblCell]{padding:20px 20px 0 20px !important;} }    
//         @media only screen and (max-width: 480px){table.bmeCaptionTable td[name=tblCell]{padding:10px !important;} }    
//         @media only screen and (max-width: 480px){table[name=tblGtr]{ padding-bottom:20px !important;} }    
//         @media only screen and (max-width: 480px){td.blk_container, .blk_parent, [name=bmeLeftColumn], [name=bmeRightColumn], [name=bmeColumn1], [name=bmeColumn2], [name=bmeColumn3], [name=bmeBody]{display:table !important;max-width:600px !important;width:100% !important;} }    
//         @media only screen and (max-width: 480px){table[class=container-table], .bmeheadertext, .container-table { width: 95% !important; } }    
//         @media only screen and (max-width: 480px){.mobile-footer, .mobile-footer a{ font-size: 13px !important; line-height: 18px !important; } .mobile-footer{ text-align: center !important; } table[class="share-tbl"] { padding-bottom: 15px; width: 100% !important; } table[class="share-tbl"] td { display: block !important; text-align: center !important; width: 100% !important; } }    
//         @media only screen and (max-width: 480px){td[name=bmeShareTD], td[name=bmeSocialTD]{width: 100% !important; } }    
//         @media only screen and (max-width: 480px){td[name=tdBoxedTextBorder]{width: auto !important;}}    
//         @media only screen and (max-width: 480px){.bmeImageCard table.bmeImageTable{height: auto !important; width:100% !important; padding:20px !important;clear:both; float:left !important; border-collapse: separate;} }    
//         @media only screen and (max-width: 480px){.bmeMblInline table.bmeImageTable{height: auto !important; width:100% !important; padding:10px !important;clear:both;} }    
//         @media only screen and (max-width: 480px){.bmeMblInline table.bmeCaptionTable{width:100% !important; clear:both;} }    
//         @media only screen and (max-width: 480px){table.bmeImageTable{height: auto !important; width:100% !important; padding:10px !important;clear:both; } }    
//         @media only screen and (max-width: 480px){table.bmeCaptionTable{width:100% !important;  clear:both;} }    
//         @media only screen and (max-width: 480px){table.bmeImageContainer{width:100% !important; clear:both; float:left !important;} }    
//         @media only screen and (max-width: 480px){table.bmeImageTable td{padding:0px !important; height: auto; } }    
//         @media only screen and (max-width: 480px){td.bmeImageContainerRow{padding:0px !important;}}    
//         @media only screen and (max-width: 480px){img.mobile-img-large{width:100% !important; height:auto !important;} }    
//         @media only screen and (max-width: 480px){img.bmeRSSImage{max-width:320px; height:auto !important;}}    
//         @media only screen and (min-width: 640px){img.bmeRSSImage{max-width:600px !important; height:auto !important;} }    
//         @media only screen and (max-width: 480px){.trMargin img{height:10px;} }    
//         @media only screen and (max-width: 480px){div.bmefooter, div.bmeheader{ display:block !important;} }    
//         @media only screen and (max-width: 480px){.tdPart{ width:100% !important; clear:both; float:left !important; } }    
//         @media only screen and (max-width: 480px){table.blk_parent1, table.tblPart {width: 100% !important; } }    
//         @media only screen and (max-width: 480px){.tblLine{min-width: 100% !important;}}     
//         @media only screen and (max-width: 480px){.bmeMblCenter img { margin: 0 auto; } }       
//         @media only screen and (max-width: 480px){.bmeMblCenter, .bmeMblCenter div, .bmeMblCenter span  { text-align: center !important; text-align: -webkit-center !important; } }    
//         @media only screen and (max-width: 480px){.bmeNoBr br, .bmeImageGutterRow, .bmeMblStackCenter .bmeShareItem .tdMblHide { display: none !important; } }    
//         @media only screen and (max-width: 480px){.bmeMblInline table.bmeImageTable, .bmeMblInline table.bmeCaptionTable, td.bmeMblInline { clear: none !important; width:50% !important; } }    
//         @media only screen and (max-width: 480px){.bmeMblInlineHide, .bmeShareItem .trMargin { display: none !important; } }    
//         @media only screen and (max-width: 480px){.bmeMblInline table.bmeImageTable img, .bmeMblShareCenter.tblContainer.mblSocialContain, .bmeMblFollowCenter.tblContainer.mblSocialContain{width: 100% !important; } }    
//         @media only screen and (max-width: 480px){.bmeMblStack> .bmeShareItem{width: 100% !important; clear: both !important;} }    
//         @media only screen and (max-width: 480px){.bmeShareItem{padding-top: 10px !important;} }    
//         @media only screen and (max-width: 480px){.tdPart.bmeMblStackCenter, .bmeMblStackCenter .bmeFollowItemIcon {padding:0px !important; text-align: center !important;} }    
//         @media only screen and (max-width: 480px){.bmeMblStackCenter> .bmeShareItem{width: 100% !important;} }    
//         @media only screen and (max-width: 480px){ td.bmeMblCenter {border: 0 none transparent !important;}}    
//         @media only screen and (max-width: 480px){.bmeLinkTable.tdPart td{padding-left:0px !important; padding-right:0px !important; border:0px none transparent !important;padding-bottom:15px !important;height: auto !important;}}    
//         @media only screen and (max-width: 480px){.tdMblHide{width:10px !important;} }    
//         @media only screen and (max-width: 480px){.bmeShareItemBtn{display:table !important;}}    
//         @media only screen and (max-width: 480px){.bmeMblStack td {text-align: left !important;}}    
//         @media only screen and (max-width: 480px){.bmeMblStack .bmeFollowItem{clear:both !important; padding-top: 10px !important;}}    
//         @media only screen and (max-width: 480px){.bmeMblStackCenter .bmeFollowItemText{padding-left: 5px !important;}}    
//         @media only screen and (max-width: 480px){.bmeMblStackCenter .bmeFollowItem{clear:both !important;align-self:center; float:none !important; padding-top:10px;margin: 0 auto;}}    
//         @media only screen and (max-width: 480px){    
//         .tdPart> table{width:100% !important;}    
//         }    
//         @media only screen and (max-width: 480px){.tdPart>table.bmeLinkContainer{ width:auto !important; }}    
//         @media only screen and (max-width: 480px){.tdPart.mblStackCenter>table.bmeLinkContainer{ width:100% !important;}}     
//         .blk_parent:first-child, .blk_parent{float:left;}    
//         .blk_parent:last-child{float:right;}    
//         /***  END ***/    

//         table[name="bmeMainBody"], body {background-color:#ffffff;}    
//          td[name="bmePreHeader"] {background-color:#ffffff;}    
//          td[name="bmeHeader"] {background:#ffffff;background-color:#f5f2d0;}    
//          td[name="bmeBody"], table[name="bmeBody"] {background-color:#ffffff;}    
//          td[name="bmePreFooter"] {background-color:#ffffff;}    
//          td[name="bmeFooter"] {background-color:#ffffff;}    
//          td[name="tblCell"], .blk {font-family:initial;font-weight:normal;font-size:initial;}    
//          table[name="blk_blank"] td[name="tblCell"] {font-family:Arial, Helvetica, sans-serif;font-size:14px;}    
//          [name=bmeMainColumnParent] {border-color:transparent;border-width:0px;border-style:none;border-radius:0px;border-collapse:separate;border-spacing:0px;overflow:visible;}    
//          [name=bmeMainContentParent] {border-color:transparent;border-width:0px;border-style:none;border-radius:0px;overflow:hidden;}    
//          [name=bmeMainContent] {border-color:transparent;border-width:0px;border-style:none;border-radius:0px;border-collapse:separate;border-spacing:0px;overflow:visible;}    

//     </style>
// </head>

// <body marginheight=0 marginwidth=0 topmargin=0 leftmargin=0 style="height: 100% !important; margin: 0; padding: 0; width: 100% !important;min-width: 100%;">
//     <table width="100%" cellspacing="0" cellpadding="0" border="0" name="bmeMainBody" style="background-color: rgb(255, 255, 255);" bgcolor="#ffffff">
//         <tbody>
//             <tr>
//                 <td width="100%" valign="top" align="center">
//                     <table cellspacing="0" cellpadding="0" border="0" name="bmeMainColumnParentTable" width="100%">
//                         <tbody>
//                             <tr>
//                                 <td name="bmeMainColumnParent" style="border: 0px none transparent; border-radius: 0px; border-collapse: separate; border-spacing: 0px; overflow: visible;">
//                                     <table name="bmeMainColumn" class="bmeMainColumn" style="max-width: 100%; overflow: visible;" cellspacing="0" cellpadding="0" border="0" align="center" width="100%">
//                                         <tbody>
//                                             <tr>
//                                                 <td width="100%" class="blk_container bmeHolder" name="bmePreHeader" valign="top" align="center" style="color: rgb(102, 102, 102); border: 0px none transparent; background-color: rgb(255, 255, 255);" bgcolor="#ffffff"></td>
//                                             </tr>
//                                             <tr>
//                                                 <td width="100%" class="bmeHolder" valign="top" align="center" name="bmeMainContentParent" style="border: 0px none transparent; border-radius: 0px; border-collapse: separate; border-spacing: 0px; overflow: hidden;">
//                                                     <table name="bmeMainContent" style="border-radius: 0px; border-collapse: separate; border-spacing: 0px; border: 0px none transparent; overflow: visible;" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
//                                                         <tbody>
//                                                             <tr>
//                                                                 <td width="100%" class="blk_container bmeHolder" name="bmeHeader" valign="top" align="center" style="border: 0px none transparent; background-color: rgb(245, 242, 208);" bgcolor="#f5f2d0">
//                                                                     <div id="dv_9" class="blk_wrapper">
//                                                                         <table width="600" cellspacing="0" cellpadding="0" border="0" class="blk" name="blk_divider" style="">
//                                                                             <tbody>
//                                                                                 <tr>
//                                                                                     <td class="tblCellMain" style="padding: 10px 20px;">
//                                                                                         <table class="tblLine" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-top-width: 0px; border-top-style: none; min-width: 1px;">
//                                                                                             <tbody>
//                                                                                                 <tr>
//                                                                                                     <td><span></span></td>
//                                                                                                 </tr>
//                                                                                             </tbody>
//                                                                                         </table>
//                                                                                     </td>
//                                                                                 </tr>
//                                                                             </tbody>
//                                                                         </table>
//                                                                     </div>
//                                                                     <div id="dv_3" class="blk_wrapper">
//                                                                         <table class="blk" name="blk_image" width="600" border="0" cellpadding="0" cellspacing="0">
//                                                                             <tbody>
//                                                                                 <tr>
//                                                                                     <td>
//                                                                                         <table width="100%" cellspacing="0" cellpadding="0" border="0">
//                                                                                             <tbody>
//                                                                                                 <tr>
//                                                                                                     <td class="bmeImage" style="padding: 15px 20px; border-collapse: collapse; height: 290px;" align="center"><img src="https://s3.amazonaws.com/admin.devstarguru.storage/emailimage/Starguru.png" class="mobile-img-large" width="560" style="max-width: 1200px; display: block; width: 560px;" alt="" border="0"></td>
//                                                                                                 </tr>
//                                                                                             </tbody>
//                                                                                         </table>
//                                                                                     </td>
//                                                                                 </tr>
//                                                                             </tbody>
//                                                                         </table>
//                                                                     </div>
//                                                                     <div id="dv_11" class="blk_wrapper">
//                                                                         <table width="600" cellspacing="0" cellpadding="0" border="0" class="blk" name="blk_divider" style="">
//                                                                             <tbody>
//                                                                                 <tr>
//                                                                                     <td class="tblCellMain" style="padding: 20px;">
//                                                                                         <table class="tblLine" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-top-width: 0px; border-top-style: none; min-width: 1px;">
//                                                                                             <tbody>
//                                                                                                 <tr>
//                                                                                                     <td><span></span></td>
//                                                                                                 </tr>
//                                                                                             </tbody>
//                                                                                         </table>
//                                                                                     </td>
//                                                                                 </tr>
//                                                                             </tbody>
//                                                                         </table>
//                                                                     </div>
//                                                                 </td>
//                                                             </tr>
//                                                             <tr>
//                                                                 <td width="100%" class="blk_container bmeHolder bmeBody" name="bmeBody" valign="top" align="center" style="color: rgb(56, 56, 56); border: 0px none transparent; background-color: rgb(255, 255, 255);" bgcolor="#ffffff">
//                                                                     <div id="dv_13" class="blk_wrapper">
//                                                                         <table width="600" cellspacing="0" cellpadding="0" border="0" class="blk" name="blk_divider" style="">
//                                                                             <tbody>
//                                                                                 <tr>
//                                                                                     <td class="tblCellMain" style="padding: 15px 20px;">
//                                                                                         <table class="tblLine" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-top-width: 0px; border-top-style: none; min-width: 1px;">
//                                                                                             <tbody>
//                                                                                                 <tr>
//                                                                                                     <td><span></span></td>
//                                                                                                 </tr>
//                                                                                             </tbody>
//                                                                                         </table>
//                                                                                     </td>
//                                                                                 </tr>
//                                                                             </tbody>
//                                                                         </table>
//                                                                     </div>
//                                                                     <div id="dv_14" class="blk_wrapper">
//                                                                         <table width="600" cellspacing="0" cellpadding="0" border="0" class="blk" name="blk_text">
//                                                                             <tbody>
//                                                                                 <tr>
//                                                                                     <td>
//                                                                                         <table cellpadding="0" cellspacing="0" border="0" width="100%" class="bmeContainerRow">
//                                                                                             <tbody>
//                                                                                                 <tr>
//                                                                                                     <td class="tdPart" valign="top" align="center">
//                                                                                                         <table cellspacing="0" cellpadding="0" border="0" width="600" name="tblText" style="float:left; background-color:transparent;" align="left" class="tblText">
//                                                                                                             <tbody>
//                                                                                                                 <tr>
//                                                                                                                     <td valign="top" align="left" name="tblCell" style="padding: 10px 20px; font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 400; color: rgb(56, 56, 56); text-align: left;" class="tblCell">
//                                                                                                                         <div style="line-height: 200%; text-align: center;"><b>Hello ${data.name},</b><span style="font-size: 14px; font-family: Arial, Helvetica, sans-serif; color: #000000; line-height: 200%;"> Thanks for registering with us. Your password is <b>${password}</b>.</span></div>
//                                                                                                                     </td>
//                                                                                                                 </tr>
//                                                                                                             </tbody>
//                                                                                                         </table>
//                                                                                                     </td>
//                                                                                                 </tr>
//                                                                                             </tbody>
//                                                                                         </table>
//                                                                                     </td>
//                                                                                 </tr>
//                                                                             </tbody>
//                                                                         </table>
//                                                                     </div>
//                                                                     <div id="dv_6" class="blk_wrapper">
//                                                                         <table class="blk" name="blk_button" width="600" border="0" cellpadding="0" cellspacing="0">
//                                                                             <tbody>
//                                                                                 <tr>
//                                                                                     <td width="20"></td>
//                                                                                     <td align="center">
//                                                                                         <table width="100%" cellspacing="0" cellpadding="0" border="0" class="tblContainer">
//                                                                                             <tbody>
//                                                                                                 <tr>
//                                                                                                     <td height="20"></td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td align="center">
//                                                                                                         <table cellspacing="0" cellpadding="0" border="0" align="center" class="bmeButton" style="border-collapse: separate;">
//                                                                                                             <tbody>
//                                                                                                                 <tr>
//                                                                                                                     <td class="bmeButtonText" style="border-radius: 0px; border: 0px none transparent; text-align: center; padding: 20px 40px; font-weight: normal; font-family: Arial, Helvetica, sans-serif; font-size: 14px; background-color: rgb(69, 153, 232);"><span style="font-family: 'Arial Narrow', 'Arial MT Condensed Light', sans-serif; font-size: 20px; color: rgb(255, 255, 255);"> <a target="_blank" style="color:#FFFFFF;text-decoration:none;">View More</a></span></td>
//                                                                                                                 </tr>
//                                                                                                             </tbody>
//                                                                                                         </table>
//                                                                                                     </td>
//                                                                                                 </tr>
//                                                                                                 <tr>
//                                                                                                     <td height="20"></td>
//                                                                                                 </tr>
//                                                                                             </tbody>
//                                                                                         </table>
//                                                                                     </td>
//                                                                                     <td width="20"></td>
//                                                                                 </tr>
//                                                                             </tbody>
//                                                                         </table>
//                                                                     </div>
//                                                                 </td>
//                                                             </tr>
//                                                             <tr>
//                                                                 <td width="100%" class="blk_container bmeHolder" name="bmePreFooter" valign="top" align="center" style="border: 0px none transparent; background-color: rgb(255, 255, 255);" bgcolor="#ffffff">
//                                                                     <div id="dv_4" class="blk_wrapper">
//                                                                         <table width="600" cellspacing="0" cellpadding="0" border="0" class="blk" name="blk_divider" style="">
//                                                                             <tbody>
//                                                                                 <tr>
//                                                                                     <td class="tblCellMain" style="padding: 30px 20px;">
//                                                                                         <table class="tblLine" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-top-width: 0px; border-top-style: none; min-width: 1px;">
//                                                                                             <tbody>
//                                                                                                 <tr>
//                                                                                                     <td><span></span></td>
//                                                                                                 </tr>
//                                                                                             </tbody>
//                                                                                         </table>
//                                                                                     </td>
//                                                                                 </tr>
//                                                                             </tbody>
//                                                                         </table>
//                                                                     </div>
//                                                                     <div id="dv_8" class="blk_wrapper">
//                                                                         <table cellspacing="0" cellpadding="0" border="0" style="" name="blk_social_follow" width="600" class="blk">
//                                                                             <tbody>
//                                                                                 <tr>
//                                                                                     <td class="tblCellMain" align="center" style="padding-top:10px; padding-bottom:10px; padding-left:20px; padding-right:20px;">
//                                                                                         <table class="tblContainer mblSocialContain" cellspacing="0" cellpadding="0" border="0" align="center" style="text-align:center;">
//                                                                                             <tbody>
//                                                                                                 <tr>
//                                                                                                     <td class="tdItemContainer" style="">
//                                                                                                         <table cellspacing="0" cellpadding="0" border="0" class="mblSocialContain" style="table-layout: auto;">
//                                                                                                             <tbody>
//                                                                                                                 <tr>
//                                                                                                                     <td valign="top" name="bmeSocialTD" class="bmeSocialTD">
//                                                                                                                         <!--[if gte mso 6]></td><td align="left" valign="top"><![endif]-->
//                                                                                                                         <table cellspacing="0" cellpadding="0" border="0" class="bmeFollowItem" type="facebook" style="float: left; display: block;" align="left">
//                                                                                                                             <tbody>
//                                                                                                                                 <tr>
//                                                                                                                                     <td align="left" class="bmeFollowItemIcon" gutter="10" width="24" style="padding-right:10px;height:20px;"> <a href="https://www.facebook.com/shapesproducts/" target=_blank style="display: inline-block;background-color: rgb(53, 91, 161);border-radius: 4px;border-style: none; border-width: 0px; border-color: rgba(0, 0, 0, 0);" target="_blank"><img src="https://s3.amazonaws.com/admin.devstarguru.storage/emailimage/facebook.png" alt="Facebook" style="display: block; max-width: 114px;" border="0" width="24" height="24"></a></td>
//                                                                                                                                 </tr>
//                                                                                                                             </tbody>
//                                                                                                                         </table>
//                                                                                                                         <!--[if gte mso 6]></td><td align="left" valign="top"><![endif]-->
//                                                                                                                         <table cellspacing="0" cellpadding="0" border="0" class="bmeFollowItem" type="twitter" style="float: left; display: block;" align="left">
//                                                                                                                             <tbody>
//                                                                                                                                 <tr>
//                                                                                                                                     <td align="left" class="bmeFollowItemIcon" gutter="10" width="24" style="padding-right:10px;height:20px;"> <a href="https://www.instagram.com/shapesproducts/" target=_blank style="display: inline-block;background-color: rgb(50, 203, 255);border-radius: 4px;border-style: none; border-width: 0px; border-color: rgba(0, 0, 0, 0);" target="_blank"><img src="https://s3.amazonaws.com/admin.devstarguru.storage/emailimage/twitter.png" alt="Twitter" style="display: block; max-width: 114px;" border="0" width="24" height="24"></a></td>
//                                                                                                                                 </tr>
//                                                                                                                             </tbody>
//                                                                                                                         </table>
//                                                                                                                         <!--[if gte mso 6]></td><td align="left" valign="top"><![endif]-->
//                                                                                                                         <table cellspacing="0" cellpadding="0" border="0" class="bmeFollowItem" type="instagram" style="float: left; display: block;" align="left">
//                                                                                                                             <tbody>
//                                                                                                                                 <tr>
//                                                                                                                                     <td align="left" class="bmeFollowItemIcon" gutter="10" width="24" style="padding-right:10px;height:20px;"> <a href="http://instagram.com" target=_blank style="display: inline-block;background-color: rgb(82, 127, 166);border-radius: 4px;border-style: none; border-width: 0px; border-color: rgb(0, 0, 238);" target="_blank"><img src="https://s3.amazonaws.com/admin.devstarguru.storage/emailimage/instagram.png" alt="Instagram" style="display: block; max-width: 114px;" border="0" width="24" height="24"></a></td>
//                                                                                                                                 </tr>
//                                                                                                                             </tbody>
//                                                                                                                         </table>
//                                                                                                                     </td>
//                                                                                                                 </tr>
//                                                                                                             </tbody>
//                                                                                                         </table>
//                                                                                                     </td>
//                                                                                                 </tr>
//                                                                                             </tbody>
//                                                                                         </table>
//                                                                                     </td>
//                                                                                 </tr>
//                                                                             </tbody>
//                                                                         </table>
//                                                                     </div>
//                                                                 </td>
//                                                             </tr>
//                                                         </tbody>
//                                                     </table>
//                                                 </td>
//                                             </tr>

//                                         </tbody>
//                                     </table>
//                                 </td>
//                             </tr>
//                         </tbody>
//                     </table>
//                 </td>
//             </tr>
//         </tbody>
//     </table>
// </body>

// </html>`,
//     });
//     return info.messageId;
// };
emailController.sendForgotPassword = async function (data, password) {
  // Read and compile the email template
  const templatePath = path.join(__dirname, '../templates', 'FORGET_PASSWORD_MAIL.html');
  const templateSource = fs.readFileSync(templatePath, 'utf-8');
  const template = handlebars.compile(templateSource);

  const htmlToSend = template({ name: data.name, password });

  let info = await transporter.sendMail({
    from: "enquiry@neofairs.com",
    cc: "enquiry@neofairs.com",
    to: data["email"],
    subject: "Forgot Password Email",
    html: htmlToSend
  });
  return info.messageId;
};

emailController.sendBookingConfirmationMail = async function (visitorId, exhibitorId, slotDetails, status) {
  try {
    // Fetch the visitor and exhibitor details
    const visitor = await Visitor.findById(visitorId);
    const exhibitor = await Exhibitor.findById(exhibitorId);

    if (!visitor || !exhibitor) {
      throw new Error("Visitor or Exhibitor not found");
    }
    let templatePathVisitor;
    let templatePathExhibitor;
    // Read and compile the email template
    if (status == "approve") {
      templatePathVisitor = path.join(__dirname, '../templates', 'MEETING_CONFIRMATION_VISITOR_MAIL.html');
      templatePathExhibitor = path.join(__dirname, '../templates', 'MEETING_CONFIRMATION_EXHIBITOR_MAIL.html');
    } else {
      templatePathVisitor = path.join(__dirname, '../templates', 'MEETING_DECLINED_VISITOR_MAIL.html');
      templatePathExhibitor = path.join(__dirname, '../templates', 'MEETING_DECLINED_EXHIBITOR_MAIL.html');
    }
    const templateSourceVisitor = fs.readFileSync(templatePathVisitor, 'utf-8');
    const templateVisitor = handlebars.compile(templateSourceVisitor);
    const templateSourceExhibitor = fs.readFileSync(templatePathExhibitor, 'utf-8');
    const templateExhibitor = handlebars.compile(templateSourceExhibitor);

    const htmlToSendVisitor = templateVisitor({
      visitorName: visitor.name,
      visitorEmail: visitor.email,
      exhibitorName: exhibitor.name,
      slotDate: slotDetails.date,
      exhibitorEmail: exhibitor.email
    });
    const htmlToSendExhibitor = templateExhibitor({
      visitorName: visitor.name,
      visitorEmail: visitor.email,
      exhibitorName: exhibitor.name,
      slotDate: slotDetails.date,
      exhibitorEmail: exhibitor.email
    });
    //     // Define email content
    //     const visitorEmailContent = `<!DOCTYPE html>
    // <html lang="en">
    // <head>
    //   <meta charset="UTF-8">
    //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //   <title>Booking Decliened</title>

    // </head>
    // <body>
    //   <div class="container">
    //     <!-- Header -->
    //     <div class="header">
    //       <img src="https://shapes.neofairs.com/images/logo-white.png" alt="Shapes Logo">
    //       <h1>Booking Declined</h1>
    //     </div>
    //     <!-- Content -->
    //     <div class="content">
    //       <p>Dear ${visitor.name},</p>
    //       <p>Your slot has been declined with ${exhibitor.name} on ${slotDetails.date}.</p>
    //       <p>If you have any questions, please contact ${exhibitor.name} at ${exhibitor.email}.</p>
    //       <p>We look forward to your participation!</p>
    //     </div>
    //     <!-- Footer with Social Media Links -->
    //     <div class="footer">

    //       <p>&copy; ${new Date().getFullYear()} NeoFairs. All rights reserved.</p>
    //       <div class="social-media">
    //         <a href="https://www.facebook.com/shapesproducts" target="_blank">
    //           <img src="https://shapes.neofairs.com/images/facebook-email.png" alt="Facebook">
    //         </a>
    //         <a href="https://www.instagram.com/shapesproducts/" target="_blank">
    //           <img src="https://shapes.neofairs.com/images/instagram.png" alt="Twitter">
    //         </a>
    //         <a href="https://www.linkedin.com/in/ashishjain1983/" target="_blank">
    //           <img src="https://shapes.neofairs.com/images/linkedin-email.png" alt="LinkedIn">
    //         </a>
    //       </div>
    //     </div>
    //   </div>
    // </body>
    // </html>

    // `;

    //     const exhibitorEmailContent = `<!DOCTYPE html>
    // <html lang="en">
    // <head>
    //   <meta charset="UTF-8">
    //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //   <title>Booking Declined Alert</title>
    //   <style>
    //     body, table, td, p, h1 {
    //       font-family: Arial, sans-serif;
    //       color: #333;
    //       text-align: left;
    //     }
    //     body {
    //       margin: 0;
    //       padding: 0;
    //       width: 100% !important;
    //     }
    //     .container {
    //       width: 100%;
    //       max-width: 600px;
    //       margin: 0 auto;
    //       background-color: #f9f9f9;
    //       padding: 20px;
    //     }
    //     .header {
    //       text-align: center;
    //       background-color: #FF5722;
    //       color: #fff;
    //       padding: 10px;
    //     }
    //     .header img {
    //       max-width: 250px;
    //       height: auto;
    //       margin-bottom: 10px;
    //     }
    //     .content {
    //       background-color: #fff;
    //       padding: 20px;
    //     }
    //     .footer {
    //       text-align: center;
    //       color: #666;
    //       font-size: 12px;
    //       padding: 10px;
    //       background-color: #f9f9f9;
    //     }
    //     .social-media {
    //       margin-top: 10px;
    //     }
    //     .social-media a {
    //       margin: 0 5px;
    //       display: inline-block;
    //     }
    //     .social-media img {
    //       width: 24px;
    //       height: 24px;
    //     }
    //     @media (max-width: 600px) {
    //       .container {
    //         padding: 15px;
    //       }
    //     }
    //   </style>
    // </head>
    // <body>
    //   <div class="container">
    //     <!-- Header -->
    //     <div class="header">
    //     <img src="https://shapes.neofairs.com/images/logo-white.png" alt="Shapes Logo">
    //       <h1>Booking Declined Alert</h1>
    //     </div>
    //     <!-- Content -->
    //     <div class="content">
    //       <p>Dear ${exhibitor.name},</p>
    //       <p>You have decliened ${visitor.name} booked a slot with you on ${slotDetails.date}.</p>
    //       <p>Visitor email: ${visitor.email}</p>
    //       <p>For further details, please contact the visitor or check your bookings dashboard.</p>
    //     </div>
    //     <!-- Footer with Social Media Links -->
    //     <div class="footer">
    //       <p>&copy; ${new Date().getFullYear()} NeoFairs. All rights reserved.</p>
    //       <div class="social-media">
    //         <a href="https://www.facebook.com/shapesproducts" target="_blank">
    //           <img src="https://shapes.neofairs.com/images/facebook-email.png" alt="Facebook">
    //         </a>
    //         <a href="https://www.instagram.com/shapesproducts/" target="_blank">
    //           <img src="https://shapes.neofairs.com/images/instagram.png" alt="Twitter">
    //         </a>
    //         <a href="https://www.linkedin.com/in/ashishjain1983/" target="_blank">
    //           <img src="https://shapes.neofairs.com/images/linkedin-email.png" alt="LinkedIn">
    //         </a>
    //       </div>
    //     </div>
    //   </div>
    // </body>
    // </html>

    // `;

    if (visitor.email) {
      // Send email to visitor
      let visitorInfo = await transporter.sendMail({
        from: "enquiry@neofairs.com",
        to: visitor.email,
        subject: status == "approve" ? "Meeting Confirmation" : "Meeting Declined",
        html: htmlToSendVisitor,
      });
    }


    // Send email to exhibitor
    let exhibitorInfo = await transporter.sendMail({
      from: "enquiry@neofairs.com",
      to: exhibitor.email,
      subject: status == "approve" ? "Meeting Confirmation" : "Meeting Declined",
      html: htmlToSendExhibitor,
    });
    visitor.phone && sendPhoneMessage(visitor.phone, `Your slot has been successfully booked with ${exhibitor.name} on ${slotDetails.date} .`);
    exhibitor.phone && sendPhoneMessage(exhibitor.phone, `${visitor.name} has booked a slot with you on ${slotDetails.date} .`);
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
    throw error;
  }
};

emailController.sendBookingRequestMail = async function (visitorId, exhibitorId, slotDetails) {
  try {
    // Fetch the visitor and exhibitor details
    const visitor = await Visitor.findById(visitorId);
    const exhibitor = await Exhibitor.findById(exhibitorId);

    if (!visitor || !exhibitor) {
      throw new Error("Visitor or Exhibitor not found");
    }

    // Read and compile the email template
    const templatePath = path.join(__dirname, '../templates', 'MEETING_REQUEST_VISITOR_MAIL.html');
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    const template = handlebars.compile(templateSource);

    const htmlToSend = template({
      visitorName: visitor.name,
      exhibitorName: exhibitor.name,
      slotDate: slotDetails.date,
      exhibitorEmail: exhibitor.email
    });

    if (visitor.email) {
      // Send email to visitor
      let visitorInfo = await transporter.sendMail({
        from: "enquiry@neofairs.com",
        to: visitor.email,
        subject: "Booking Request Submitted",
        html: htmlToSend,
      });
    }

    // Read and compile the email template
    const templatePathExhibitor = path.join(__dirname, '../templates', 'MEETING_REQUEST_EXHIBITOR_MAIL.html');
    const templateSourceExhibitor = fs.readFileSync(templatePathExhibitor, 'utf-8');
    const templateExhibitor = handlebars.compile(templateSourceExhibitor);

    const htmlToSendExhibitor = templateExhibitor({
      visitorName: visitor.name,
      exhibitorName: exhibitor.name,
      slotDate: slotDetails.date,
      exhibitorEmail: exhibitor.email
    });
    // Send email to exhibitor
    let exhibitorInfo = await transporter.sendMail({
      from: "enquiry@neofairs.com",
      to: exhibitor.email,
      subject: "New Booking Request",
      html: htmlToSendExhibitor,
    });
    visitor.phone && sendPhoneMessage(visitor.phone, `Your request to book a slot with ${exhibitor.name} on ${slotDetails.date} has been submitted successfully.`);
    exhibitor.phone && sendPhoneMessage(exhibitor.phone, `${visitor.name} has requested a booking with you on ${slotDetails.date}.`);
  } catch (error) {
    console.error("Error sending booking request email:", error);
    throw error;
  }
};

emailController.sendStallVisitSMS = async function (req, res) {
  try {
    const { visitorId, exhibitorId } = req.body;
    // Fetch the visitor and exhibitor details
    const visitor = await Visitor.findById(visitorId);
    const exhibitor = await Exhibitor.findById(exhibitorId);

    exhibitor.phone && sendPhoneMessage(exhibitor.phone, `${visitor?.name} has visited the stall now.`);
  } catch (error) {
    console.error("Error sending booking request email:", error);
    throw error;
  }
};


module.exports = emailController;
