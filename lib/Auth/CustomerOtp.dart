import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:pinput/pinput.dart';
import 'package:therapyshala/utils/constants.dart';
import 'package:therapyshala/utils/flutter_color_themes.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';

import '../widget/buttonWigiets.dart';
import '../widget/custom_bottom_navbar.dart';

class OtpCustomerScreen extends StatefulWidget {
  final String? mobileNumber;
  OtpCustomerScreen({super.key, this.mobileNumber});

  @override
  State<OtpCustomerScreen> createState() => _OtpCustomerScreenState();
}

class _OtpCustomerScreenState extends State<OtpCustomerScreen> {
  Timer? _timer;
  int _secondsRemaining = 56;

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _startTimer() {
    _timer?.cancel();
    setState(() {
      _secondsRemaining = 56;
    });
    _timer = Timer.periodic(Duration(seconds: 1), (timer) {
      if (_secondsRemaining > 0) {
        setState(() {
          _secondsRemaining--;
        });
      } else {
        _timer?.cancel();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final defaultPinTheme = PinTheme(
      width: 54,
      height: 54,
      textStyle: TextStyle(
        fontSize: 22,
        fontWeight: FontWeight.w600,
        color: Color(0xff0D0D12),
      ),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: Color(0xffE7E7EA)),
        borderRadius: BorderRadius.circular(12),
      ),
    );

    final focusedPinTheme = defaultPinTheme.copyDecorationWith(
      border: Border.all(
        color: Color(0xffF35271),
        width: 1.5,
      ),
      color: Color(0xffFFEEF1),
    );

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: AppColors.black),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                Constants.enterVerificationCode,
                style: FTextStyle.loginHeading(context),
              ),
              SizedBox(height: 4),
              Text(
                widget.mobileNumber != null && widget.mobileNumber!.isNotEmpty
                    ? '${Constants.weHaveSentAVerificationCode} +91 ${widget.mobileNumber}'
                    : Constants.weHaveSentAVerificationCode,
                style: FTextStyle.loginDesc(context),
              ),
              SizedBox(height: 15),
              Center(
                child: Pinput(
                  length: 4,
                  keyboardType: TextInputType.number,
                  defaultPinTheme: defaultPinTheme,
                  focusedPinTheme: focusedPinTheme,
                  submittedPinTheme: defaultPinTheme,
                  separatorBuilder: (index) => SizedBox(width: 20),
                  inputFormatters: [
                    FilteringTextInputFormatter.digitsOnly,
                  ],
                ),
              ),
              SizedBox(height: 16),
              if (_secondsRemaining > 0)
                Center(
                  child: Text.rich(
                    TextSpan(
                      children: [
                        TextSpan(
                          text: Constants.youCanResendTheCodeIn,
                          style: FTextStyle.loginDesc(context),
                        ),
                        TextSpan(
                          text: " $_secondsRemaining ",
                          style: FTextStyle.loginDesc(context).copyWith(
                            color: AppColors.primary,
                          ),
                        ),
                        TextSpan(
                          text: "seconds",
                          style: FTextStyle.loginDesc(context),
                        ),
                      ],
                    ),
                  ),
                ),
              Center(
                child: TextButton(
                  onPressed: _secondsRemaining == 0
                      ? () {
                          _startTimer();
                        }
                      : null,
                  child: Text(
                    Constants.resendOtp,
                    style: FTextStyle.loginDesc(context).copyWith(
                      color: _secondsRemaining == 0
                          ? AppColors.primary
                          : Colors.grey,
                    ),
                  ),
                ),
              ),
              SizedBox(height: 16),
              CustomButton(
                text: 'Verify Otp',
                onPressed: () {
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(
                      builder: (context) => MainScreenWithBottomNav(),
                    ),
                    (route) => false,
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}