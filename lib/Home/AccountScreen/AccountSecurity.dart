import 'package:flutter/material.dart';
import 'package:therapyshala/utils/constants.dart';
import 'package:therapyshala/utils/flutter_color_themes.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';
import 'package:therapyshala/widget/custom_snackbar.dart';

class AccountSecurityScreen extends StatefulWidget {
  AccountSecurityScreen({super.key});

  @override
  State<AccountSecurityScreen> createState() => _AccountSecurityScreenState();
}

class _AccountSecurityScreenState extends State<AccountSecurityScreen> {
  bool _autoLogin = true;
  String _mobileNumber = "+91 98765 43210";

  void _showChangeMobileDialog() {
    final TextEditingController newPhoneController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text(
          Constants.changeMobileNumber,
          style: FTextStyle.header(context),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "An OTP will be sent to verify your new mobile number.",
              style: FTextStyle.desc(context),
            ),
            SizedBox(height: 14),
            Container(
              height: 50,
              padding: EdgeInsets.symmetric(horizontal: 14),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Color(0xFFEBEBEB)),
              ),
              child: Row(
                children: [
                  Text("🇮🇳", style: TextStyle(fontSize: 18)),
                  SizedBox(width: 6),
                  Text(
                    Constants.countryCode,
                    style: FTextStyle.tittle(context),
                  ),
                  SizedBox(width: 8),
                  VerticalDivider(
                    color: Color(0xFFEBEBEB),
                    thickness: 1,
                    indent: 10,
                    endIndent: 10,
                  ),
                  SizedBox(width: 8),
                  Expanded(
                    child: TextField(
                      controller: newPhoneController,
                      keyboardType: TextInputType.phone,
                      style: FTextStyle.tittle(context),
                      decoration: InputDecoration(
                        hintText: Constants.placeHolderMNo,
                        hintStyle: FTextStyle.desc(context),
                        border: InputBorder.none,
                        isDense: true,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(Constants.cancel),
          ),
          ElevatedButton(
            onPressed: () {
              if (newPhoneController.text.trim().length < 10) {
                CustomSnackBar.show(
                  context,
                  message: Constants.mNoValidation,
                  icon: Icons.warning_amber_rounded,
                );
                return;
              }
              setState(() {
                _mobileNumber = "${Constants.countryCode} ${newPhoneController.text.trim()}";
              });
              Navigator.pop(context);
              CustomSnackBar.show(
                context,
                message: Constants.otpSent,
                icon: Icons.check_circle_rounded,
                backgroundColor: AppColors.add,
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
            ),
            child: Text(
              Constants.sendOtp,
              style: TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }

  void _showDeleteAccountDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text(
          Constants.deleteAccount,
          style: FTextStyle.header(context),
        ),
        content: Text(
          Constants.deleteAccountConfirm,
          style: FTextStyle.desc(context),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(Constants.cancel),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              CustomSnackBar.show(
                context,
                message: Constants.accountDeleted,
                icon: Icons.info_outline_rounded,
                backgroundColor: AppColors.reds,
              );
            },
            child: Text(
              Constants.deleteAccount,
              style: TextStyle(color: AppColors.reds, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: Center(
          child: GestureDetector(
            onTap: () => Navigator.pop(context),
            child: Icon(
              Icons.arrow_back,
              color: Colors.black,
              size: 18,
            ),
          ),
        ),
        title: Text(
          Constants.accountSecurity,
          style: FTextStyle.header(context),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Security Info Badge Banner
              Container(
                width: double.infinity,
                padding: EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Color(0xFFFFF0F3),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.primaryLight),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(
                      Icons.verified_user_rounded,
                      color: AppColors.primary,
                      size: 24,
                    ),
                    SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        Constants.otpSecurityInfo,
                        style: FTextStyle.desc(context)
                      ),
                    ),
                  ],
                ),
              ),

              SizedBox(height: 24),

              // Registered Mobile Number Section
              Text(
                Constants.registeredMobileNumber,
                style: FTextStyle.header(context),
              ),
              SizedBox(height: 10),
              Container(
                padding: EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Color(0xFFEBEBEB)),
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.phone_android_rounded,
                      color: AppColors.primary,
                      size: 22,
                    ),
                    SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            Constants.mNo,
                            style: FTextStyle.desc(context)
                          ),
                          SizedBox(height: 2),
                          Text(
                            _mobileNumber,
                            style: FTextStyle.tittle(context)
                          ),
                        ],
                      ),
                    ),
                    GestureDetector(
                      onTap: _showChangeMobileDialog,
                      child: Container(
                        padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppColors.primaryLight,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          Constants.change,
                          style: FTextStyle.price(context)
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              SizedBox(height: 24),

              // Login Security Preferences
              Text(
                Constants.loginSecurity,
                style: FTextStyle.header(context),
              ),
              SizedBox(height: 6),
              ListTile(
                contentPadding: EdgeInsets.zero,
                dense: true,
                title: Text(
                  Constants.autoLogin,
                  style: FTextStyle.tittle(context),
                ),
                subtitle: Text(
                 Constants.keepMobileSessionActive,
                  style: FTextStyle.desc(context)
                ),
                trailing: Switch.adaptive(
                  value: _autoLogin,
                  activeColor: AppColors.primary,
                  onChanged: (val) {
                    setState(() {
                      _autoLogin = val;
                    });
                  },
                ),
              ),

              Divider(color: Color(0xFFF0F0F3), height: 24),

              // Delete Account Tile
              ListTile(
                contentPadding: EdgeInsets.zero,
                onTap: _showDeleteAccountDialog,
                leading: Icon(
                  Icons.delete_forever_rounded,
                  color: AppColors.reds,
                  size: 22,
                ),
                title: Text(
                  Constants.deleteAccount,
                  style: FTextStyle.tittle(context).copyWith(
                    color: AppColors.reds,
                  ),
                ),
                trailing: Icon(
                  Icons.chevron_right_rounded,
                  color: AppColors.reds,
                  size: 20,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
