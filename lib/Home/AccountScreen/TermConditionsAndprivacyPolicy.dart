import 'package:flutter/material.dart';
import 'package:therapyshala/utils/flutter_font_style.dart';

class TermConditionsAndPrivacyPolicyScreen extends StatelessWidget {
  final bool isPrivacyPolicy;

  TermConditionsAndPrivacyPolicyScreen({
    super.key,
    this.isPrivacyPolicy = false,
  });

  @override
  Widget build(BuildContext context) {
    final title = isPrivacyPolicy ? "Privacy & Policy" : "Term & Condition";

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
          title,
          style: FTextStyle.header(context),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: isPrivacyPolicy ? _buildPrivacyContent(context) : _buildTermsContent(context),
          ),
        ),
      ),
    );
  }

  List<Widget> _buildPrivacyContent(BuildContext context) {
    return [
      _buildHeading(context, "1. Types of Data We Collect"),
      _buildBody(
        context,
        "We collect several different types of information for various purposes to provide and improve our service to you, including Personal Data (name, email, phone number, location, date of birth) and Usage Data.",
      ),
      SizedBox(height: 16),
      _buildHeading(context, "2. Use of Data"),
      _buildBody(
        context,
        "TherapyShala uses the collected data for various purposes: to provide and maintain our Service, to notify you about changes to our Service, to allow you to participate in interactive features, to provide customer care and support, and to monitor usage.",
      ),
      SizedBox(height: 16),
      _buildHeading(context, "3. Transfer & Security of Data"),
      _buildBody(
        context,
        "Your information, including Personal Data, may be transferred to and maintained on computers located outside of your state or jurisdiction. The security of your data is important to us, and we strive to use commercially acceptable means to protect your personal information.",
      ),
      SizedBox(height: 16),
      _buildHeading(context, "4. Disclosure of Data"),
      _buildBody(
        context,
        "TherapyShala may disclose your Personal Data in good faith belief that such action is necessary to comply with a legal obligation, protect and defend the rights or property of TherapyShala, or protect the personal safety of users.",
      ),
    ];
  }

  List<Widget> _buildTermsContent(BuildContext context) {
    return [
      _buildHeading(context, "1. Acceptance of Terms"),
      _buildBody(
        context,
        "By accessing and using TherapyShala, you accept and agree to be bound by the terms and provisions of this agreement. In addition, when using TherapyShala services, you shall be subject to any posted guidelines or rules.",
      ),
      SizedBox(height: 16),
      _buildHeading(context, "2. Service Bookings & Payments"),
      _buildBody(
        context,
        "All appointments booked through TherapyShala must be paid according to the prices listed at the time of booking. Therapists are independent service providers, and appointment schedules must be respected.",
      ),
      SizedBox(height: 16),
      _buildHeading(context, "3. Cancellation & Refund Policy"),
      _buildBody(
        context,
        "Cancellations made 2 hours prior to the scheduled appointment time are eligible for an 80% refund. Cancellations made past the 2-hour window may be subject to non-refundable service fees.",
      ),
      SizedBox(height: 16),
      _buildHeading(context, "4. Limitation of Liability"),
      _buildBody(
        context,
        "TherapyShala will not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of, or inability to access or use, the services.",
      ),
    ];
  }

  Widget _buildHeading(BuildContext context, String title) {
    return Text(
      title,
      style: FTextStyle.header(context)
    );
  }

  Widget _buildBody(BuildContext context, String body) {
    return Padding(
      padding: EdgeInsets.only(top: 8),
      child: Text(
        body,
        style: FTextStyle.desc(context)
      ),
    );
  }
}
