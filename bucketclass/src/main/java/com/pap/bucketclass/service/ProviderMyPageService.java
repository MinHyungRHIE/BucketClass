package com.pap.bucketclass.service;

import static com.pap.bucketclass.util.RoleFilter.containRoleByName;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.pap.bucketclass.entity.Member;
import com.pap.bucketclass.model.PasswordModel;
import com.pap.bucketclass.model.ProviderMyPageModel;
import com.pap.bucketclass.repository.MemberRepository;

@Service
public class ProviderMyPageService {
	
	@Autowired
	private LocalMemberDetailsService memberDetailsService;
	@Autowired
	private MemberRepository memberRepo;
	
	//제공자 정보 불러오기
	@Transactional
	public Member loadMember(String memberId) {
		Member member = (Member) memberDetailsService.loadUserByUsername(memberId);
		Member found = null;
		if(containRoleByName(member.getRoles(), "ROLE_PROVIDER")) {
			found = memberRepo.findByMemberId(memberId);
		}else {
			throw new AccessDeniedException("403 error");
		}
		return found;
	}
	
	//제공자 정보 수정
	@Transactional
	public Member updateMember(ProviderMyPageModel providerModel, String memberId) {
		Member member = memberRepo.findByMemberId(memberId);
		if (member != null) {
			member.setMemberNickname(providerModel.getMemberNickname());
			member.setMemberEmail(providerModel.getMemberEmail());
			member.setIntroduce(providerModel.getIntroduce());
			member.setCareer(providerModel.getCareer());
			member.setCerti(providerModel.getCerti());
		} else {
			throw new AccessDeniedException("403 error");
		}
		return memberRepo.save(member);
	}
	
	@Transactional
	public Boolean changePassword(PasswordModel model, String memberId) {
		Member member = memberRepo.findByMemberId(memberId);
		if(member != null && 
				member.getPassword().equals(model.getMemberPassword()) &&
				!(model.getMemberPassword().equals(model.getNewPassword()))) {
			member.setMemberPassword(model.getNewPassword());
			memberRepo.save(member);
			return true;
		}else {
			return false;
		}
	}
}
