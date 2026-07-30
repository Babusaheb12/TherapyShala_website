import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../Auth/chooseLoginRole.dart';
import '../utils/ImageAssets.dart';
import '../utils/constants.dart';
import '../utils/flutter_color_themes.dart';
import '../utils/flutter_font_style.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key, this.onGetStarted, this.onSignIn});

  final VoidCallback? onGetStarted;
  final VoidCallback? onSignIn;

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _continue() {
    if (_currentPage == Constants.onboardingTitles.length - 1) {
      if (widget.onGetStarted != null) {
        widget.onGetStarted!.call();
      } else {
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (context) =>  chooseLoginRole()),
          (route) => false,
        );
      }
      return;
    }

    _pageController.nextPage(
      duration: const Duration(milliseconds: 320),
      curve: Curves.easeOutCubic,
    );
  }

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.light.copyWith(
        statusBarColor: Colors.transparent,
        systemNavigationBarColor: Color(0xFF0D0D12),
        systemNavigationBarIconBrightness: Brightness.light,
      ),
      child: Scaffold(
        backgroundColor: AppColors.textPrimary,
        body: Stack(
          children: [
            // Fixed Background Image
            Positioned.fill(
              child: Image.asset(
                ImageAssets.onboardingImages[_currentPage],
                fit: BoxFit.cover,
              ),
            ),

            // Gradient
            Positioned.fill(
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Color(0x150D0D12),
                      Color(0x990D0D12),
                      Color(0xFF0D0D12),
                    ],
                    stops: [0.2, .55, 1],
                  ),
                ),
              ),
            ),

            SafeArea(
              child: Column(
                children: [
                  Spacer(),
                  // Swipable Title & Description
                  Expanded(
                    flex: 3,
                    child: PageView.builder(
                      controller: _pageController,
                      physics: ClampingScrollPhysics(),
                      itemCount: Constants.onboardingTitles.length,
                      onPageChanged: (index) {
                        setState(() {
                          _currentPage = index;
                        });
                      },
                      itemBuilder: (_, index) {
                        return Padding(
                          padding: const EdgeInsets.fromLTRB(18, 240, 18, 0), // Top padding 100
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                Constants.onboardingTitles[index],
                                textAlign: TextAlign.center,
                                style: FTextStyle.onboardingHeading(context)
                                    .copyWith(
                                      color: Colors.white,
                                      height: 1.38,
                                      letterSpacing: -0.65,
                                    ),
                              ),
                              SizedBox(height: 10),
                              Text(
                                Constants.onboardingDescription,
                                textAlign: TextAlign.center,
                                style: FTextStyle.onboardingDesc(
                                  context,
                                ).copyWith(color: Color(0xFF9C9EAB)),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ),

                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 22),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        SizedBox(
                          width: double.infinity,
                          height: 50,
                          child: ElevatedButton(
                            onPressed: _continue,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primary,
                              foregroundColor: Colors.white,
                              elevation: 0,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(20),
                              ),
                            ),
                            child: Text(
                              _currentPage ==
                                      Constants.onboardingTitles.length - 1
                                  ? Constants.onboardingGetStarted
                                  : Constants.onboardingNext,
                              style: FTextStyle.onboardingButton(context),
                            ),
                          ),
                        ),
                        const SizedBox(height: 20),
                        IgnorePointer(
                          ignoring:
                              _currentPage !=
                              Constants.onboardingTitles.length - 1,
                          child: Opacity(
                            opacity:
                                _currentPage ==
                                    Constants.onboardingTitles.length - 1
                                ? 1.0
                                : 0.0,
                            child: GestureDetector(
                              onTap: () {
                                if (widget.onSignIn != null) {
                                  widget.onSignIn!.call();
                                } else {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (context) => chooseLoginRole(),
                                    ),
                                  );
                                }
                              },
                              child: RichText(
                                text: TextSpan(
                                  style: FTextStyle.onboardingAccount(
                                    context,
                                  ).copyWith(color: Colors.white),
                                  children: [
                                    TextSpan(
                                      text:
                                          '${Constants.onboardingAccountPrompt}  ',
                                    ),
                                    TextSpan(
                                      text: Constants.onboardingSignIn,
                                      style:
                                          FTextStyle.onboardingAccount(
                                            context,
                                          ).copyWith(
                                            color: AppColors.primary,
                                            fontWeight: FontWeight.w500,
                                          ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
