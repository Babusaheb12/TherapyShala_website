import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../utils/ImageAssets.dart';
import '../utils/constants.dart';
import '../utils/flutter_color_themes.dart';
import '../utils/flutter_font_style.dart';
import '../widget/buttonWigiets.dart';
import 'CustomerOtp.dart';
import 'TherapistOtp.dart';

enum LoginRole { customer, therapist }

class chooseLoginRole extends StatefulWidget {
  chooseLoginRole({super.key, this.onRoleSelected, this.onContinue});

  final ValueChanged<LoginRole>? onRoleSelected;

  final void Function(LoginRole role, String mobileNumber)? onContinue;

  @override
  State<chooseLoginRole> createState() => _chooseLoginRoleState();
}

class _chooseLoginRoleState extends State<chooseLoginRole> {
  final _mobileController = TextEditingController();
  LoginRole _selectedRole = LoginRole.customer;
  String? _mobileError;

  @override
  void dispose() {
    _mobileController.dispose();
    super.dispose();
  }

  void _selectRole(LoginRole role) {
    setState(() => _selectedRole = role);
    widget.onRoleSelected?.call(role);
  }

  void _continue() {
    final mobileNumber = _mobileController.text.trim();
    final digitsOnly = mobileNumber.replaceAll(RegExp(r'\D'), '');

    if (digitsOnly.length != 10) {
      setState(
        () => _mobileError = Constants.mNoValidation,
      );
      return;
    }

    setState(() => _mobileError = null);
    widget.onContinue?.call(_selectedRole, digitsOnly);

    if (_selectedRole == LoginRole.customer) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => OtpCustomerScreen(mobileNumber: digitsOnly),
        ),
      );
    } else {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => OtpTherapistScreen(mobileNumber: digitsOnly),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final isCustomer = _selectedRole == LoginRole.customer;
    final roleName = isCustomer ? Constants.customer : Constants.therapist;

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.light.copyWith(
        statusBarColor: Colors.transparent,
        systemNavigationBarColor: Color(0xFF0D0D12),
        systemNavigationBarIconBrightness: Brightness.light,
      ),
      child: Scaffold(
        body: Stack(
          fit: StackFit.expand,
          children: [
            Image.asset(ImageAssets.chooseRoleBackground, fit: BoxFit.cover),
            DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [Color(0x330D0D12), Color(0xE60D0D12)],
                ),
              ),
            ),
            SafeArea(
              child: SingleChildScrollView(
                padding: EdgeInsets.fromLTRB(24, 22, 24, 24),
                child: ConstrainedBox(
                  constraints: BoxConstraints(
                    minHeight: MediaQuery.sizeOf(context).height - 70,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Center(
                        child: Container(
                          width: 62,
                          height: 62,
                          padding: EdgeInsets.all(6),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: .12),
                            borderRadius: BorderRadius.circular(19),
                            border: Border.all(
                              color: Colors.white.withValues(alpha: .2),
                            ),
                          ),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(13),
                            child: Image.asset(
                              ImageAssets.appIcon,
                              fit: BoxFit.contain,
                            ),
                          ),
                        ),
                      ),
                      SizedBox(height: 12),
                      Center(
                        child: Text(
                          Constants.appName,
                          style: FTextStyle.chooseRoleButton(context).copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.w700,
                            fontSize: 20,
                          ),
                        ),
                      ),
                      SizedBox(height: 42),
                      Text(
                        Constants.sigIn,
                        style: FTextStyle.chooseRoleTitle(context).copyWith(
                          color: Colors.white,
                          fontSize: 28,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      SizedBox(height: 8),
                      Text(
                        'Choose how you want to use ${Constants.appName}.',
                        style: FTextStyle.chooseRoleSubtitle(
                          context,
                        ).copyWith(color: Color(0xFFC0BAC0), fontSize: 15),
                      ),
                      SizedBox(height: 28),
                      Row(
                        children: [
                          Expanded(
                            child: _RoleOption(
                              label: Constants.customer,
                              icon: Icons.person_rounded,
                              selected: isCustomer,
                              activeColor: AppColors.primary,
                              onTap: () => _selectRole(LoginRole.customer),
                            ),
                          ),
                          SizedBox(width: 12),
                          Expanded(
                            child: _RoleOption(
                              label: Constants.therapist,
                              icon: Icons.spa_rounded,
                              selected: !isCustomer,
                              activeColor: Color(0xFFF4B6C5),
                              onTap: () => _selectRole(LoginRole.therapist),
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 30),
                      Text(
                          '$roleName ${Constants.mNo}',
                          style: FTextStyle.chooseRoleButton(context),
                      ),
                      SizedBox(height: 10),
                      AutofillGroup(
                        child: TextField(
                          controller: _mobileController,
                          keyboardType: TextInputType.phone,
                          autofillHints: [AutofillHints.telephoneNumber],
                          textInputAction: TextInputAction.done,
                          maxLength: 10,
                          onChanged: (_) {
                            if (_mobileError != null)
                              setState(() => _mobileError = null);
                          },
                          onSubmitted: (_) => _continue(),
                          inputFormatters: [
                            FilteringTextInputFormatter.digitsOnly,
                          ],
                          style: TextStyle(color: Colors.white, fontSize: 17),
                          decoration: InputDecoration(
                            counterText: '',
                            prefixIcon: Padding(
                              padding: EdgeInsets.only(left: 16, right: 12),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(
                                    Constants.countryCode,
                                    style: TextStyle(
                                      color: Colors.white70,
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                  SizedBox(width: 10),
                                  Container(
                                    width: 1,
                                    height: 18,
                                    color: Colors.white24,
                                  ),
                                ],
                              ),
                            ),
                            prefixIconConstraints: BoxConstraints(
                              minWidth: 0,
                              minHeight: 0,
                            ),
                            hintText: Constants.placeHolderMNo,
                            hintStyle: TextStyle(color: Color(0xFF968E94)),
                            errorText: _mobileError,
                            errorStyle: TextStyle(color: Color(0xFFFFB4B4)),
                            filled: true,
                            fillColor: Color(0xFF1E171B).withValues(alpha: .86),
                            contentPadding: EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 18,
                            ),
                            enabledBorder: _border(
                              Colors.white.withValues(alpha: .14),
                            ),
                            focusedBorder: _border(
                              isCustomer ? AppColors.primary : Color(0xFFF4B6C5),
                              1.5,
                            ),
                            errorBorder: _border(Color(0xFFFF8A8A)),
                            focusedErrorBorder: _border(Color(0xFFFF8A8A), 1.5),
                          ),
                        ),
                      ),
                      SizedBox(height: 20),
                      CustomButton(
                        text: 'Continue as $roleName',
                        onPressed: _continue,
                        backgroundColor: isCustomer ? AppColors.primary : Color(0xFFF4B6C5),
                        textColor: Color(0xFF20171B),
                        height: 54,
                        borderRadius: 16,
                        // textStyle: TextStyle(
                        //   fontSize: 16,
                        //   fontWeight: FontWeight.w700,
                        //   color: Color(0xFF20171B),
                        // ),
                      ),
                      SizedBox(height: 18),
                      Center(
                        child: Text(
                          Constants.wellSendAnOTP,
                          style: FTextStyle.chooseRoleSubtitle(context)
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  OutlineInputBorder _border(Color color, [double width = 1]) =>
      OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: BorderSide(color: color, width: width),
      );
}

class _RoleOption extends StatelessWidget {
  _RoleOption({
    required this.label,
    required this.icon,
    required this.selected,
    required this.activeColor,
    required this.onTap,
  });

  final String label;
  final IconData icon;
  final bool selected;
  final Color activeColor;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(18),
        child: AnimatedContainer(
          duration: Duration(milliseconds: 180),
          padding: EdgeInsets.symmetric(vertical: 17),
          decoration: BoxDecoration(
            color: selected
                ? activeColor.withValues(alpha: .18)
                : Color(0xFF1E171B).withValues(alpha: .78),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(
              color: selected
                  ? activeColor
                  : Colors.white.withValues(alpha: .14),
              width: selected ? 1.5 : 1,
            ),
          ),
          child: Column(
            children: [
              Icon(
                icon,
                color: selected ? activeColor : Colors.white70,
                size: 28,
              ),
              SizedBox(height: 8),
              Text(
                label,
                style: TextStyle(
                  color: selected ? Colors.white : Colors.white70,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
