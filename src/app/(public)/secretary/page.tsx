import React from 'react';
import CommitteeMemberDisplay from '@/components/public/CommitteeMemberDisplay';

export default function SecretaryMessagePage() {
  return <CommitteeMemberDisplay roleFilter="Secretary" pageTitle="Secretary's Message" />;
}
