import React from 'react';
import CommitteeMemberDisplay from '@/components/public/CommitteeMemberDisplay';

export default function ChairmanMessagePage() {
  return <CommitteeMemberDisplay roleFilter="Chairman" pageTitle="Chairman's Message" />;
}
