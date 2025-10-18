# AWS Deployment Guide

This guide explains how to deploy Vibe-beats to AWS using different methods.

## Option 1: AWS Amplify (Easiest)

AWS Amplify is the easiest way to deploy your Vite SPA. It provides automatic builds, CI/CD, and custom domains.

### Setup Steps:

1. **Connect your GitHub repository to AWS Amplify:**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
   - Click "Create app" → "Host web app"
   - Choose "GitHub" as source
   - Authorize and select `ydvSajal/Vibe-beats`

2. **Amplify will automatically detect your settings:**
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `build`

3. **Deploy:**
   - Click "Save and deploy"
   - Amplify will build and deploy your app
   - Get a live URL instantly (e.g., `https://main.xxxxx.amplifyapp.com`)

4. **Connect custom domain (optional):**
   - In Amplify console → Domain management
   - Add your domain and configure DNS records

---

## Option 2: AWS S3 + CloudFront (More Control)

For more control over caching, SSL, and distribution, use S3 + CloudFront.

### Prerequisites:
- AWS Account with CLI access
- AWS CLI installed: `pip install awscli`
- IAM role with S3 and CloudFront permissions

### Setup Steps:

1. **Deploy CloudFormation Stack:**
   ```bash
   aws cloudformation create-stack \
     --stack-name vibe-beats-stack \
     --template-body file://cloudformation.yaml \
     --region us-east-1
   ```

2. **Wait for stack creation:**
   ```bash
   aws cloudformation wait stack-create-complete \
     --stack-name vibe-beats-stack \
     --region us-east-1
   ```

3. **Get stack outputs:**
   ```bash
   aws cloudformation describe-stacks \
     --stack-name vibe-beats-stack \
     --query "Stacks[0].Outputs" \
     --region us-east-1
   ```

4. **Build and deploy your app:**
   ```bash
   npm run build
   aws s3 sync build/ s3://vibe-beats-app-<ACCOUNT-ID>/ --delete --region us-east-1
   ```

5. **Invalidate CloudFront cache:**
   ```bash
   aws cloudfront create-invalidation \
     --distribution-id <DISTRIBUTION-ID> \
     --paths "/*"
   ```

---

## Option 3: GitHub Actions (Automated CI/CD)

Automatically deploy to AWS on every push to `main` branch.

### Setup Steps:

1. **Create an IAM Role for GitHub Actions:**
   ```bash
   # Create trust policy document
   cat > trust-policy.json << 'EOF'
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": {
           "Federated": "arn:aws:iam::<ACCOUNT-ID>:oidc-provider/token.actions.githubusercontent.com"
         },
         "Action": "sts:AssumeRoleWithWebIdentity",
         "Condition": {
           "StringEquals": {
             "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
             "token.actions.githubusercontent.com:sub": "repo:ydvSajal/Vibe-beats:ref:refs/heads/main"
           }
         }
       }
     ]
   }
   EOF

   # Create IAM role
   aws iam create-role \
     --role-name github-vibe-beats-deploy \
     --assume-role-policy-document file://trust-policy.json
   ```

2. **Create an inline policy for the role:**
   ```bash
   cat > policy.json << 'EOF'
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:DeleteObject",
           "s3:ListBucket"
         ],
         "Resource": [
           "arn:aws:s3:::vibe-beats-app-*",
           "arn:aws:s3:::vibe-beats-app-*/*"
         ]
       },
       {
         "Effect": "Allow",
         "Action": [
           "cloudfront:CreateInvalidation"
         ],
         "Resource": "*"
       }
     ]
   }
   EOF

   aws iam put-role-policy \
     --role-name github-vibe-beats-deploy \
     --policy-name vibe-beats-deploy-policy \
     --policy-document file://policy.json
   ```

3. **Add GitHub Secrets:**
   - Go to GitHub repo → Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `AWS_ROLE_ARN`: Get from IAM role
     - `AWS_S3_BUCKET`: Your S3 bucket name (from CloudFormation outputs)
     - `AWS_CLOUDFRONT_DISTRIBUTION_ID`: From CloudFormation outputs

4. **Deploy:**
   - GitHub Actions will automatically deploy on push to `main`
   - Check the "Actions" tab to see build status

---

## Monitoring and Maintenance

### View CloudFront Statistics:
```bash
aws cloudfront list-distributions --query "DistributionList.Items[0].[Id,DomainName]"
```

### Clear CloudFront Cache:
```bash
aws cloudfront create-invalidation \
  --distribution-id <DISTRIBUTION-ID> \
  --paths "/*"
```

### View S3 Bucket Contents:
```bash
aws s3 ls s3://vibe-beats-app-<ACCOUNT-ID>/
```

---

## Cost Estimation

- **AWS Amplify**: Free tier covers 1,000 build minutes/month (usually sufficient)
- **S3**: ~$0.023 per GB stored, minimal egress costs
- **CloudFront**: ~$0.085 per GB served (cheaper with high traffic)
- **Total**: Usually under $5/month for a small SPA

---

## Troubleshooting

### Deployment fails with "Permission denied"
- Ensure IAM role has correct permissions
- Check S3 bucket policy allows CloudFront access

### 404 errors on page refresh
- Ensure CloudFront error handling is configured (should be in CloudFormation template)
- Check S3 bucket has index.html at root

### Cache not updating
- Run CloudFront invalidation: `aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"`

### High costs
- Reduce CloudFront TTL values in CloudFormation template
- Use S3 lifecycle policies to expire old versions
