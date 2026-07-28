import 'package:flutter/material.dart';
import 'package:therapyshala/utils/flutter_color_themes.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';
import 'package:therapyshala/widget/buttonWigiets.dart';
import 'eRecipt.dart';

class PaymentSuccessfulScreen extends StatefulWidget {
  final String serviceTitle;
  final String bookingDate;
  final String bookingHours;
  final String beautician;
  final String package;
  final String totalPrice;
  final bool isDialog;

  const PaymentSuccessfulScreen({
    super.key,
    this.serviceTitle = "Euphoria Spa & Beauty Lounge",
    this.bookingDate = "December 28, 2024",
    this.bookingHours = "11.00 AM",
    this.beautician = "Aria Harris",
    this.package = "Basic",
    this.totalPrice = "₹1,500.00",
    this.isDialog = false,
  });

  static Future<void> show(
    BuildContext context, {
    required String serviceTitle,
    required String bookingDate,
    required String bookingHours,
    required String beautician,
    required String package,
    required String totalPrice,
  }) {
    return showDialog(
      context: context,
      barrierDismissible: true,
      builder: (context) => Dialog(
        backgroundColor: Colors.white,
        insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 32),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(28),
          child: SizedBox(
            height: 520,
            child: PaymentSuccessfulScreen(
              serviceTitle: serviceTitle,
              bookingDate: bookingDate,
              bookingHours: bookingHours,
              beautician: beautician,
              package: package,
              totalPrice: totalPrice,
              isDialog: true,
            ),
          ),
        ),
      ),
    );
  }

  @override
  State<PaymentSuccessfulScreen> createState() =>
      _PaymentSuccessfulScreenState();
}

class _PaymentSuccessfulScreenState extends State<PaymentSuccessfulScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _animController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _rippleAnimation;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration:  Duration(milliseconds: 1400),
    );

    _scaleAnimation = CurvedAnimation(
      parent: _animController,
      curve:  Interval(0.0, 0.6, curve: Curves.elasticOut),
    );

    _rippleAnimation = CurvedAnimation(
      parent: _animController,
      curve:  Interval(0.2, 0.8, curve: Curves.easeOut),
    );

    _fadeAnimation = CurvedAnimation(
      parent: _animController,
      curve:  Interval(0.5, 1.0, curve: Curves.easeIn),
    );

    _slideAnimation = Tween<Offset>(
      begin:  Offset(0, 0.2),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _animController,
      curve:  Interval(0.5, 1.0, curve: Curves.easeOutCubic),
    ));

    _animController.forward();
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding:  EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            children: [
               Spacer(),

              // Animated Success Checkmark Icon with Concentric Ripple Rings
              AnimatedBuilder(
                animation: _animController,
                builder: (context, child) {
                  return Stack(
                    alignment: Alignment.center,
                    children: [
                      // Outer Soft Pink Ripple Ring
                      Transform.scale(
                        scale: 1.0 + (_rippleAnimation.value * 0.45),
                        child: Container(
                          width: 140,
                          height: 140,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: AppColors.primary
                                .withValues(alpha: 0.12 * (1 - _rippleAnimation.value)),
                          ),
                        ),
                      ),

                      // Middle Pink Light Ring
                      Container(
                        width: 110,
                        height: 110,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppColors.primaryLight,
                        ),
                      ),

                      // Inner Animated Pink Circle + Check Icon
                      ScaleTransition(
                        scale: _scaleAnimation,
                        child: Container(
                          width: 74,
                          height: 74,
                          decoration:  BoxDecoration(
                            shape: BoxShape.circle,
                            color: AppColors.primary,
                            boxShadow: [
                              BoxShadow(
                                color: Color(0x40FF5E7E),
                                blurRadius: 18,
                                offset: Offset(0, 8),
                              ),
                            ],
                          ),
                          child:  Icon(
                            Icons.check_rounded,
                            color: Colors.white,
                            size: 44,
                          ),
                        ),
                      ),
                    ],
                  );
                },
              ),

               SizedBox(height: 16),

              // Animated Slide & Fade Text Content
              SlideTransition(
                position: _slideAnimation,
                child: FadeTransition(
                  opacity: _fadeAnimation,
                  child: Column(
                    children: [
                      Text(
                        "Payment Successfully",
                        style: FTextStyle.header(context)
                      ),
                       SizedBox(height: 12),
                      Padding(
                        padding:  EdgeInsets.symmetric(horizontal: 16),
                        child: Text(
                          "Your booking has been confirmed! We have sent the confirmation receipt to your email.",
                          textAlign: TextAlign.center,
                          style: FTextStyle.desc(context)
                        ),
                      ),
                    ],
                  ),
                ),
              ),

               Spacer(),

              // Animated Buttons (See Detail + More Service)
              SlideTransition(
                position: _slideAnimation,
                child: FadeTransition(
                  opacity: _fadeAnimation,
                  child: Column(
                    children: [
                      // Primary Button: See Detail
                      CustomButton(
                        text: "See Detail",
                        onPressed: () {
                          if (widget.isDialog) {
                            Navigator.pop(context); // Pop popup dialog
                          }
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => EReceiptScreen(
                                serviceTitle: widget.serviceTitle,
                                bookingDate: widget.bookingDate,
                                bookingHours: widget.bookingHours,
                                beautician: widget.beautician,
                                package: widget.package,
                                totalPrice: widget.totalPrice,
                              ),
                            ),
                          );
                        },
                        height: 52,
                        borderRadius: 16,
                      ),

                      const SizedBox(height: 16),

                      // Secondary Text Button: More Service
                      GestureDetector(
                        onTap: () {
                          if (widget.isDialog) {
                            Navigator.pop(context); // Pop popup dialog
                          } else {
                            Navigator.pop(context);
                          }
                        },
                        child: Container(
                          padding:  EdgeInsets.symmetric(vertical: 10),
                          child: Text(
                            "More Service",
                            style: FTextStyle.tittle(context).copyWith(
                              color: AppColors.primary,
                              fontWeight: FontWeight.bold,
                              fontSize: 15,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
